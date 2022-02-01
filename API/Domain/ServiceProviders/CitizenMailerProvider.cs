using CoC.Blacksmith.Common;
using Domain.DomainModels;
using Domain.DomainModels.Configuration;
using Domain.DomainModels.EmailTemplates;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DomainServices
{
    /**
    * Services to send email
    */

    public class CitizenCommunicateProvider
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly CitizenCommunicateOptions _emailerOptions;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<CitizenCommunicateProvider>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public CitizenCommunicateProvider(IHttpClientFactory httpClientFactory,
            IOptions<CitizenCommunicateOptions> emailerOptions)
        {
            _httpClientFactory = httpClientFactory;
            _emailerOptions = emailerOptions.Value;
        }

        public async Task<CitizenCommunicateSendResult> SendBccEmail(List<Recipient> recipients, IEmailTemplate emailTemplate)
        {
            var correlationId = Guid.NewGuid().ToString();

            var bccLine = string.Empty;
            foreach (var recipient in recipients)
            {
                bccLine += $"{recipient.Email},";
            }
            bccLine.TrimEnd(',');

            var request = new ICSMessageRouterEmailRequest
            {
                EmailBody = _ToBase64Encoding(emailTemplate.Body()),
                EmailTo = _emailerOptions.Settings.EmailFrom,
                EmailFrom = _GetFrom(),
                EmailClient = _emailerOptions.Settings.EmailClient,
                EmailBCC = bccLine,
                EmailSubject = emailTemplate.Subject(),
                isHTML = _emailerOptions.Settings.IsHtmlBody ? "true" : "false",
            };

            try
            {
                return await _SendEmail(request, correlationId);
            }
            catch (Exception ex)
            {
                _logger.LogError(message: $"Error sending email to {bccLine}.", exception: ex);
                return new CitizenCommunicateSendResult(null, ex.Message, correlationId, request.EmailTo, request.EmailBCC);
            }
        }

        public async Task<CitizenCommunicateSendResult> SendEmail(Recipient recipient, IEmailTemplate emailTemplate)
        {
            var correlationId = Guid.NewGuid().ToString();

            var request = new ICSMessageRouterEmailRequest
            {
                EmailBody = _ToBase64Encoding(emailTemplate.Body()),
                EmailTo = recipient.Email,
                EmailFrom = _GetFrom(),
                EmailClient = _emailerOptions.Settings.EmailClient,
                EmailSubject = emailTemplate.Subject(),
                isHTML = _emailerOptions.Settings.IsHtmlBody ? "true" : "false",
            };

            try
            {
                return await _SendEmail(request, correlationId);
            }
            catch (Exception ex)
            {
                _logger.LogError(message: $"Error sending email to {recipient.Email}.", exception: ex);
                return new CitizenCommunicateSendResult(null, ex.Message, correlationId, request.EmailTo, request.EmailBCC);
            }
        }

        /// <summary>
        /// POST a JSON string to AWS email service
        /// </summary>
        private async Task<CitizenCommunicateSendResult> _SendEmail(
            ICSMessageRouterEmailRequest request, string correlationId)
        {
            var enabled = _emailerOptions.Settings.Enabled;
            if (!enabled)
                _logger.LogDebug("Sending email. (note: not enabled)");
            else
                _logger.LogDebug("Sending email.");

            if (!enabled)
            {
                return new CitizenCommunicateSendResult(null, "Email not enabled", null, request.EmailTo, request.EmailBCC);
            }

            //
            // prepare request content

            var jsonData = JsonConvert.SerializeObject(
                new
                {
                    Request = request
                });

            var content = new StringContent(jsonData, Encoding.UTF8, HttpKeyValues.ApplicationJson);
            content.Headers.TryAddWithoutValidation(HttpKeyValues.CorrelationId, correlationId);

            //
            // make service call

            var httpClient = _httpClientFactory.CreateClient(CitizenCommunicateKeys.ClientName);

            using (var response = await httpClient.PostAsync(CitizenCommunicateKeys.EmailEndpoint, content))
            {
                if (!response.IsSuccessStatusCode)
                {
                    return new CitizenCommunicateSendResult(null, response.StatusCode.ToString(), correlationId, request.EmailTo, request.EmailBCC);
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var responseObject = JsonConvert.DeserializeObject<ICSMessageRouterResponse>(responseContent);

                return new CitizenCommunicateSendResult(responseObject, null, correlationId, request.EmailTo, request.EmailBCC);
            }
        }

        private string _GetFrom()
        {
            var email = _emailerOptions.Settings.EmailFrom;
            var name = _emailerOptions.Settings.EmailFromName;

            if (string.IsNullOrEmpty(name))
                return email;

            return $"{name} <{email}>";
        }

        private string _ToBase64Encoding(string htmlText)
        {
            var htmlTextBytes
                = Encoding.UTF8.GetBytes(WebUtility.HtmlDecode(htmlText)
                    ?? throw new InvalidOperationException(
                        "Failed to perform WebUtility.HtmlDecode() of the notification template because the template is null"));

            return Convert.ToBase64String(htmlTextBytes);
        }
    }
}

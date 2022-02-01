using CoC.Blacksmith.Common;
using Domain.DomainModels.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Domain.ServiceProviders
{
    /**
    * Services interact with keyvault to retreive keys
    */

    public class KeyVaultProvider
    {
        private readonly IHttpClientFactory _factory;
        private readonly KeyVaultAccessOptions _options;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<KeyVaultProvider>();

        public KeyVaultProvider(ILogger<KeyVaultProvider> logger, IHttpClientFactory clientFactory, IOptions<KeyVaultAccessOptions> options)
        {
            _factory = clientFactory;
            _options = options.Value;
            _logger = logger;
        }

        public async Task<string> GetKeyVaultCredentials()
        {
            var token = await GetToken();
            var client = _factory.CreateClient("KeyVaultAccess");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);

            using (var response = await client.GetAsync("/api/keys"))
            {
                var content = await response.Content.ReadAsStringAsync();
                return content;
            }
        }

        public async Task<AuthenticationResult> GetToken()
        {
            var scopes = new[] { this._options.Options.Scopes };
            var app = ConfidentialClientApplicationBuilder.Create(this._options.Options.ClientId)
                .WithTenantId(this._options.Options.Tenant)
                .WithRedirectUri(this._options.Options.RedirectUri)
                .WithClientSecret(this._options.Options.ClientSecret)
                .Build();

            string url = String.Format(this._options.Options.Authority, this._options.Options.Tenant);
            return await app.AcquireTokenForClient(scopes).WithAuthority(url, true).ExecuteAsync();
        }
    }
}

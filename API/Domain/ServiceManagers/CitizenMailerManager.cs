using CoC.Blacksmith.Common;
using Domain.DomainModels;
using Domain.DomainModels.Configuration;
using Domain.DomainModels.EmailTemplates;
using Domain.DomainServices;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.ServiceManagers
{
    /**
    * Manage the sending of email, using either individual sending or chunked BCC methods
    */

    public class CitizenCommunicateManager
    {
        private readonly CitizenCommunicateProvider _CitizenCommunicateProvider;
        private readonly RecipientManifestProvider _recipientManifestProvider;
        private readonly CitizenCommunicateOptions _emailerOptions;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<CitizenCommunicateManager>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public CitizenCommunicateManager(CitizenCommunicateProvider CitizenCommunicateProvider,
            RecipientManifestProvider recipientManifestProvider,
            IOptions<CitizenCommunicateOptions> emailerOptions)
        {
            _CitizenCommunicateProvider = CitizenCommunicateProvider;
            _recipientManifestProvider = recipientManifestProvider;
            _emailerOptions = emailerOptions.Value;
        }

        public async Task Send(RecipientManifest manifest, IEmailTemplate emailTemplate)
        {
            var bccMode = _emailerOptions.Settings.BccMode;

            if (bccMode)
            {
                _logger.LogInformation($"Sending {manifest.Recipients.Count} emails in BCC mode.");
                await _SendBccChunks(manifest, emailTemplate);
            }
            else
            {
                _logger.LogInformation($"Sending {manifest.Recipients.Count} emails in TO mode.");
                await _SendIndividually(manifest, emailTemplate);
            }
        }

        private async Task _SendIndividually(RecipientManifest manifest, IEmailTemplate emailTemplate)
        {
            foreach (var recipient in manifest.Recipients)
            {
                await _ObserveQuota();
                var result = await _CitizenCommunicateProvider.SendEmail(recipient, emailTemplate);
                _WriteResultLog(manifest, new List<Recipient>() { recipient }, result);
            }
        }

        private async Task _SendBccChunks(RecipientManifest manifest, IEmailTemplate emailTemplate)
        {
            var bccChunkSize = _emailerOptions.Settings.BccChunkSize;

            var recipientCount = manifest.Recipients.Count;
            var bccRecipientList = new List<Recipient>();

            for (var i = 0; i < recipientCount; i++)
            {
                bccRecipientList.Add(manifest.Recipients[i]);

                if (i % bccChunkSize == 0)
                {
                    await _SendBccChunk(manifest, bccRecipientList, emailTemplate);
                    bccRecipientList.Clear();
                }
            }

            if (bccRecipientList.Count > 0) // send to any remaining recipients
            {
                await _SendBccChunk(manifest, bccRecipientList, emailTemplate);
            }
        }

        private async Task _SendBccChunk(RecipientManifest manifest, List<Recipient> bccRecipientList, IEmailTemplate emailTemplate)
        {
            _logger.LogInformation($"Sending BCC Chunk ({bccRecipientList.Count}).");
            await _ObserveQuota();
            var result = await _CitizenCommunicateProvider.SendBccEmail(bccRecipientList, emailTemplate);
            _WriteResultLog(manifest, bccRecipientList, result);
        }

        private long _lastSendSecond = 0;
        private int _lastSendCount = 0;

        private static SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        private async Task _ObserveQuota()
        {
            var perSecondQuota = _emailerOptions.Settings.PerSecondQuota;
            var quotaEnabled = perSecondQuota > 0;

            if (!quotaEnabled)
                return;

            await _semaphore.WaitAsync();

            try
            {
                var proposedSendSecond = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;

                if (_lastSendSecond == 0 || _lastSendSecond < proposedSendSecond)
                {
                    _lastSendSecond = proposedSendSecond;
                    _lastSendCount = 0;
                }

                _lastSendCount++;
                _lastSendSecond = proposedSendSecond;

                if (_lastSendCount >= perSecondQuota)
                {
                    await Task.Delay(1000);
                }
            }
            finally
            {
                _semaphore.Release();
            }
        }

        private void _WriteResultLog(RecipientManifest manifest,
            List<Recipient> recipients, CitizenCommunicateSendResult sendResult)
        {
            foreach (var recipient in recipients)
            {
                recipient.PopulateSendResults(sendResult);
            }

            _recipientManifestProvider.Log(manifest, recipients);
        }
    }
}

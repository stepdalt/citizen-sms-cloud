using CoC.Blacksmith.Common;
using Domain.DomainModels;
using Domain.DomainModels.EmailTemplates;
using Domain.ServiceManagers;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Domain.DomainServices
{
    /**
    * Wrapper service layer for Email functions
    */

    public class CitizenCommunicateService
    {
        private readonly CitizenCommunicateManager _CitizenCommunicateManager;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<CitizenCommunicateService>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public CitizenCommunicateService(CitizenCommunicateManager CitizenCommunicateManager)
        {
            _CitizenCommunicateManager = CitizenCommunicateManager;
        }

        public async Task SendFairEntryEmail(RecipientManifest manifest)
        {
            _logger.LogInformation("Processing job: Fair Entry Citizen Email");

            var emailTemplate = new FairEntryEmailTemplate();
            await _CitizenCommunicateManager.Send(manifest, emailTemplate);
        }
    }
}

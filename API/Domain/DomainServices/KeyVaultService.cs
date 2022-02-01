using CoC.Blacksmith.Common;
using Domain.ServiceProviders;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DomainServices
{
    /**
    * Wrapper service layer for key vault functions
    */

    public interface IKeyVaultService
    {
        Task<string> GetKeyVaultCredentials();
    }

    public class KeyVaultService : IKeyVaultService
    {
        private readonly KeyVaultProvider _keyvaultProvider;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<KeyVaultService>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public KeyVaultService(KeyVaultProvider keyvaultProvider)
        {
            _keyvaultProvider = keyvaultProvider;
        }

        public async Task<string> GetKeyVaultCredentials()
        {
            return await _keyvaultProvider.GetKeyVaultCredentials();
        }
    }
}

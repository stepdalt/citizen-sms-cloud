using CoC.Blacksmith.Http.Utilities.Integration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DomainModels.Configuration
{
    public class KeyVaultAccessOptions: HttpServiceOptions
    {
        public ApiAccessOptions Options { get; set; }
    }

    public class ApiAccessOptions
    {
        public string Scopes { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Tenant { get; set; }
        public string RedirectUri { get; set; }
        public string Authority { get; set; }
    }
}

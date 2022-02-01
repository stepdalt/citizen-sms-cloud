using Domain.DomainServices;
using Domain.ServiceManagers;
using Domain.ServiceProviders;
using Microsoft.Extensions.DependencyInjection;

namespace Domain.Utilities
{
    public static class DomainExtensions
    {
        public static void AddDomainServices(this IServiceCollection services)
        {
            services.AddScoped<CitizenCommunicateProvider>();
            services.AddScoped<CitizenCommunicateManager>();
            services.AddScoped<CitizenCommunicateService>();
            services.AddScoped<SMSProvider>();
            services.AddScoped<ISMSService, SMSService>();
            services.AddScoped<KeyVaultProvider>();
            services.AddScoped<IKeyVaultService, KeyVaultService>();
            services.AddScoped<RecipientManifestProvider>();
        }
    }
}

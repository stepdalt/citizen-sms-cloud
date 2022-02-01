using CoC.Blacksmith.DataAccess;
using CoC.Blacksmith.Http.Utilities.Integration;
using CoC.Blacksmith.Security;
using CoC.Blacksmith.Security.ACF;
using Domain.DomainModels.Configuration;
using Domain.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Oracle.ManagedDataAccess.Client;

namespace WebService
{
    /// <summary>
    /// Handles the application-specific configuration.
    /// </summary>
    public class AppRegistration
    {
        /// <summary>
        /// Configure application services.
        /// </summary>
        public static void ConfigureService(IServiceCollection services, IConfiguration config, IHostingEnvironment env)
        {
            //
            // add domain services

            services.AddDomainServices();

            var section = config.GetSection("ACF");
            services.Configure<ACFOptions>(section);

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CocAuthenticationDefaults.AcfAuthenticationScheme;
            })
            .AddSecurityValidator<ACFConnector>(CocAuthenticationDefaults.AcfAuthenticationScheme);

            services.ConfigureIntegrationOptions<KeyVaultAccessOptions>(config.GetSection("Integrations:HttpServices:KeyVaultAccess"));

            //
            // database client registry

            services.AddSingleton(sp =>
            {
                var registry = new DbClientFactoryRegistry();
                registry.Add(OracleClientFactory.Instance);
                return registry;
            });
        }

        /// <summary>
        /// Add application middleware to each incoming HTTP request.
        /// </summary>
        public static void AddMiddleware(IApplicationBuilder app, IConfiguration config, IHostingEnvironment env)
        {
        }
    }
}

using ConsoleUI.Command;
using Domain.DomainModels.Configuration;
using Domain.Utilities;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConsoleUI
{
    /// <summary>
    /// Application-specific command and service registrations.
    /// </summary>
    public static class ConsoleExtensions
    {
        /// <summary>
        /// Define the commands that the console app will implement.
        /// </summary>
        public static void ConfigureCommands(this CommandLineApplication app)
        {
            //
            // process command line arguments and execute the application
            // based on practices from https://gist.github.com/iamarcel/9bdc3f40d95c13f80d259b7eb2bbcabb

            app.Command("SendEmail", c => SendEmailCommand.Configure(c));
            app.Command("GenerateTestManifest", c => GenerateTestManifestCommand.Configure(c));
            app.Command("GetSMSResources", c => GetSMSResourcesCommand.Configure(c));
            app.Command("SendSMS", c => SendSMSCommand.Configure(c));
            app.Command("RegisterPhoneNumbers", c => RegisterSMSUsersCommand.Configure(c));
            app.Command("RegisterNewTopic", c => RegisterSMSTopicCommand.Configure(c));
            app.Command("RemoveUsers", c => UnRegisterSMSUsersCommand.Configure(c));
        }

        /// <summary>
        /// Configure additional application-specific services.
        /// </summary>
        public static void AddAppServices(this IServiceCollection services, IConfigurationRoot config, string environmentName)
        {
            services.Configure<CitizenCommunicateOptions>(config.GetSection($"Integrations:HttpServices:{CitizenCommunicateKeys.ClientName}"));
            services.Configure<KeyVaultAccessOptions>(config.GetSection($"Integrations:HttpServices:KeyVaultAccess"));
            //
            // Configure the domain services.

            services.AddDomainServices();
        }
    }
}

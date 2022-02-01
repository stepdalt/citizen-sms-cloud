using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Order the sending of mass SMS message to list of pre-determined recipients
    /// </summary>
    public class SendEmailCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Send mass emails to the public.";
            command.HelpOption("-?|-h|--help");

            var manifestOption = command.Option(
                "-m|--manifest",
                "Manifest file.",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var manifest = manifestOption.HasValue() ? manifestOption.Value() : @"c:\CitizenCommunicate\testmanifest.csv";
                (new SendEmailCommand(manifest)).Run();

                return 0;
            });
        }

        private readonly string _manifest;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<SendEmailCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public SendEmailCommand(string manifest)
        {
            _manifest = manifest;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'SendEmail' job...");

            var recipientManifestProvider = (RecipientManifestProvider)Program.ServiceProvider.GetService(typeof(RecipientManifestProvider));
            var citizenEmailerService = (CitizenCommunicateService)Program.ServiceProvider.GetService(typeof(CitizenCommunicateService));

            var manifest = recipientManifestProvider.LoadManifest(_manifest);
            citizenEmailerService.SendFairEntryEmail(manifest)
                .GetAwaiter().GetResult();

            _logger.LogInformation("Completed 'SendEmail' job...");
        }
    }
}

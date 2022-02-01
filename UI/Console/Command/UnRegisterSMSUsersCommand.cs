using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using System.IO;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Remove registered SMS users from AWS directory
    /// </summary>
    public class UnRegisterSMSUsersCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Remove from SMS List";
            command.HelpOption("-?|-h|--help");

            var arnOption = command.Option(
                "-a|--arn",
                "ARN",
                CommandOptionType.SingleValue);

            var manifestOption = command.Option(
                "-m|--manifest",
                "Manifest file.",
                CommandOptionType.SingleValue);


            command.OnExecute(() =>
            {
                var arn = arnOption.HasValue() ? arnOption.Value() : null;
                var manifest = manifestOption.HasValue() ? manifestOption.Value() : null;

                if (string.IsNullOrWhiteSpace(manifest) && string.IsNullOrWhiteSpace(arn))
                {
                    return 0;
                }
                (new UnRegisterSMSUsersCommand(arn, manifest)).Run();

                return 0;
            });
        }

        private readonly string _manifest;
        private readonly string _arn;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<UnRegisterSMSUsersCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public UnRegisterSMSUsersCommand(string arn, string manifest)
        {
            _arn = arn;
            _manifest = manifest;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'Remove users' job...");


            var sMSService = (SMSService)Program.ServiceProvider.GetService(typeof(ISMSService));

            if (!string.IsNullOrWhiteSpace(_manifest))
            {
                if (!File.Exists(_manifest))
                {
                    _logger.LogInformation("Job failed, file not found");
                    return;
                }

                var lines = File.ReadAllText(_manifest);

                var manifest = lines.Split(',');
                foreach(var recip in manifest)
                {
                    sMSService.UnsubscribeFromTopic(recip);
                }
            }
            else if (!string.IsNullOrWhiteSpace(_arn))
            {
                sMSService.UnsubscribeFromTopic(_arn);
            }
            

            _logger.LogInformation("Completed 'Remove users' job...");
        }
    }
}

using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Order the sending of mass SMS message to list of pre-determined recipients
    /// </summary>
    public class SendSMSCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Send mass sms to the a list.";
            command.HelpOption("-?|-h|--help");

            var arnOption = command.Option(
                "-a|--arn",
                "ARN",
                CommandOptionType.SingleValue);

            var messageOption = command.Option(
                "-m|--message",
                "SMS Message",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var arn = arnOption.HasValue() ? arnOption.Value() : null;
                var message = messageOption.HasValue() ? messageOption.Value() : @"Test message";
                if (string.IsNullOrWhiteSpace(arn))
                {
                    return 0;
                }
                (new SendSMSCommand(arn, message)).Run();

                return 0;
            });
        }

        private readonly string _message;
        private readonly string _arn;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<SendSMSCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public SendSMSCommand(string arn, string message)
        {
            _arn = arn;
            _message = message;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'SendSMS' job...");

            var recipientManifestProvider = (RecipientManifestProvider)Program.ServiceProvider.GetService(typeof(RecipientManifestProvider));
            var sMSService = (SMSService)Program.ServiceProvider.GetService(typeof(ISMSService));

            sMSService.PublishMessage(_arn, _message);

            _logger.LogInformation("Completed 'SendSMS' job...");
        }
    }
}

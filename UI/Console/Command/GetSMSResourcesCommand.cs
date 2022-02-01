using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Return data on current resource lists
    /// </summary>
    public class GetSMSResourcesCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "get sms resources.";
            command.HelpOption("-?|-h|--help");

            var arnOption = command.Option(
                "-a|--arn",
                "ARN",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var arn = arnOption.HasValue() ? arnOption.Value() : null;
                (new GetSMSResourcesCommand(arn)).Run();

                return 0;
            });
        }

        private readonly string _arn;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<GetSMSResourcesCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public GetSMSResourcesCommand(string arn) {
            _arn = arn;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'getSMS' job...");

            var sMSService = (SMSService)Program.ServiceProvider.GetService(typeof(ISMSService));

            var topics = sMSService.GetTopicList();

            _logger.LogInformation("Topics:");

            foreach (var topic in topics)
            {
                _logger.LogInformation("  Topic ARN: {0}", topic);

            }

            var subscriptions = (string.IsNullOrEmpty(_arn)) ? sMSService.GetSubscriptionList() : sMSService.GetSubscriptionList(_arn);

            _logger.LogInformation("Subscriptions:");

            foreach (var subscription in subscriptions)
            {
                _logger.LogInformation("  Subscription ARN: {0}", subscription);

            }

            _logger.LogInformation("Completed 'GetSMSResources' job...");
        }
    }
}

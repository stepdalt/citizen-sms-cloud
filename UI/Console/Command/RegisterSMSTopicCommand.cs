using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using System.IO;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Create new AWS SMS Topic to hold user list
    /// </summary>
    public class RegisterSMSTopicCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Set up SMS Topic";
            command.HelpOption("-?|-h|--help");

            var topicNameOption = command.Option(
                "-n|--name",
                "New Topic Name",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var topicName = topicNameOption.HasValue() ? topicNameOption.Value() : null;
                if (string.IsNullOrWhiteSpace(topicName))
                {
                    return 0;
                }
                (new RegisterSMSTopicCommand(topicName)).Run();

                return 0;
            });
        }

        private readonly string _topicName;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<RegisterSMSTopicCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public RegisterSMSTopicCommand(string topicName)
        {
            _topicName = topicName;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'Register New Topic' job...");


            var sMSService = (SMSService)Program.ServiceProvider.GetService(typeof(ISMSService));

            var newTopic = sMSService.CreateSNSTopic(_topicName);
            _logger.LogInformation($"New topic created: {newTopic}");

            _logger.LogInformation("Completed 'Register New Topic' job...");
        }
    }
}

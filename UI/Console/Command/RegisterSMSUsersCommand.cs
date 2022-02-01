using CoC.Blacksmith.Common;
using Domain.DomainServices;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Add new user(s) to the SMS recipient list
    /// </summary>
    public class RegisterSMSUsersCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Set up SMS List";
            command.HelpOption("-?|-h|--help");

            var arnOption = command.Option(
                "-a|--arn",
                "ARN",
                CommandOptionType.SingleValue);

            var manifestOption = command.Option(
                "-m|--manifest",
                "Manifest file.",
                CommandOptionType.SingleValue);

            var phoneOption = command.Option(
                "-p|--phone",
                "Phone Number",
                CommandOptionType.SingleValue);

            var outputOption = command.Option(
                "-o|--output",
                "Output ARNs",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var arn = arnOption.HasValue() ? arnOption.Value() : null;
                var manifest = manifestOption.HasValue() ? manifestOption.Value() : null;
                var phoneNumber = phoneOption.HasValue() ? phoneOption.Value() : null;
                var output = outputOption.HasValue() ? outputOption.Value() : null;
                if ((string.IsNullOrWhiteSpace(phoneNumber) && string.IsNullOrWhiteSpace(manifest)) || string.IsNullOrWhiteSpace(arn))
                {
                    return 0;
                }
                (new RegisterSMSUsersCommand(arn, manifest, phoneNumber, output)).Run();

                return 0;
            });
        }

        private readonly string _phoneNumber;
        private readonly string _manifest;
        private readonly string _arn;
        private readonly string _outputFile;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<RegisterSMSUsersCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public RegisterSMSUsersCommand(string arn, string manifest, string phoneNumber, string outputFile)
        {
            _arn = arn;
            _manifest = manifest;
            _phoneNumber = phoneNumber;
            _outputFile = outputFile;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation("Running 'Add Numbers' job...");


            var sMSService = (SMSService)Program.ServiceProvider.GetService(typeof(ISMSService));

            if (!string.IsNullOrWhiteSpace(_manifest))
            {
                if (!File.Exists(_manifest))
                {
                    _logger.LogInformation("Job failed, file not found");
                    return;
                }

                var outputArns = new List<string>();

                var lines = File.ReadAllText(_manifest);

                var manifest = lines.Split(',');
                foreach(var recip in manifest)
                {
                    outputArns.Add(sMSService.SubscribeToTopic(_arn, "sms", recip));
                }

                if (!string.IsNullOrWhiteSpace(_outputFile))
                {
                    using (StreamWriter file = new StreamWriter(_outputFile))
                    {
                        foreach (string arnOut in outputArns)
                        {
                            file.WriteLine(arnOut);
                        }
                    }
                }
            }
            else if (!string.IsNullOrWhiteSpace(_phoneNumber))
            {
                var outArn = sMSService.SubscribeToTopic(_arn, "sms", _phoneNumber);
                _logger.LogInformation($"Added {_phoneNumber} as {outArn}");
            }
            

            _logger.LogInformation("Completed 'Add Numbers' job...");
        }
    }
}

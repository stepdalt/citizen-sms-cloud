using CoC.Blacksmith.Common;
using Domain.DomainModels;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace ConsoleUI.Command
{
    /// <summary>
    /// Generate a test manifest file
    /// </summary>
    public class GenerateTestManifestCommand
    {
        /// <summary>
        /// Configure the available options and help.
        /// </summary>
        public static void Configure(CommandLineApplication command)
        {
            command.Description = "Generate a test manifest file.";
            command.HelpOption("-?|-h|--help");

            var nameOption = command.Option(
                "-n|--name",
                "Manifest name.",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                var name = nameOption.HasValue() ? nameOption.Value() : Guid.NewGuid().ToString();
                (new GenerateTestManifestCommand(name)).Run();

                return 0;
            });
        }

        private readonly string _name;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<SendEmailCommand>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public GenerateTestManifestCommand(string name)
        {
            _name = name;
        }

        /// <summary>
        /// Run the command.
        /// </summary>
        public void Run()
        {
            _logger.LogInformation($"Generating test manifest '{_name}'...");
            _logger.LogInformation(@"Location: C:\CitizenCommunicate\TestManifest.csv");

            var path = @"C:\CitizenCommunicate\TestManifest.csv";
            var manifest = new RecipientManifest();

            for (var i = 0; i < 15000; i++)
            {
                manifest.AddRecipient(new Recipient($"T{i}", $"L{i}", $"tl{i}@calgary.ca"));
            }

            Directory.CreateDirectory(@"C:\CitizenCommunicate");

            foreach (var recipient in manifest.Recipients)
            {
                File.AppendAllLines(path, new string[] { recipient.ToString() });
            }

            _logger.LogInformation("Completed 'SendEmail' job...");
        }
    }
}

using CoC.Blacksmith.Common;
using Domain.DomainModels;
using Domain.Utilities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Domain.DomainServices
{
    /**
    * Services to intake recipient manifests
    */

    public interface IRecipientManifestProvider
    {
        //RecipientManifest Create();
    }

    public class RecipientManifestProvider : IRecipientManifestProvider
    {
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<RecipientManifestProvider>();

        public RecipientManifest LoadManifest(string path)
        {
            if (!File.Exists(path))
            {
                throw new Exception($"Manifest file at '{path}' does not exist.");
            }

            var result = new RecipientManifest();
            result.Path = path;

            var lines = File.ReadLines(path);

            var progress = 0;

            foreach (var line in lines)
            {
                if (string.IsNullOrEmpty(line))
                    continue;

                var split = CsvUtils.ReadCSVLine(line);
                var firstName = "";
                var lastName = "";
                var email = split[0];

                result.AddRecipient(new Recipient(firstName, lastName, email));
                _logger.LogDebug($"Read in: '{email}'");

                progress++;
            }

            _logger.LogInformation($"Total read: {progress}");

            return result;
        }

        public void Log(RecipientManifest manifest, List<Recipient> recipients)
        {

            var path = Path.GetDirectoryName(manifest.Path);
            File.AppendAllLines($@"{path}\log.csv", recipients.Select(m => m.ToString()));
        }
    }
}

using CoC.Blacksmith.Http.Utilities.Integration;

namespace Domain.DomainModels.Configuration
{
    public class CitizenCommunicateOptions : HttpServiceOptions
    {
        public CitizenCommunicateSettings Settings { get; set; }
    }

    public class CitizenCommunicateSettings
    {
        public string EmailFrom { get; set; }
        public string EmailFromName { get; set; }
        public string EmailClient { get; set; }
        public bool IsHtmlBody { get; set; }
        public bool BccMode { get; set; } = false;
        public int BccChunkSize { get; set; } = 2;
        public int PerSecondQuota { get; set; } = 0; // default is no quota
        public bool Enabled { get; set; } = false;
    }

    public class CitizenCommunicateKeys
    {
        public const string ClientName = "CitizenCommunicate";
        public const string EmailEndpoint = "api/icsmessagerouter/email";
    }
}

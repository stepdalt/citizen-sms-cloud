namespace Domain.DomainModels
{
    public class ICSMessageRouterEmailRequest
    {
        public string EmailFrom { get; set; }
        public string EmailTo { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
        public string EmailBCC { get; set; }
        public string EmailClient { get; set; }
        public string isHTML { get; set; }
    }
}

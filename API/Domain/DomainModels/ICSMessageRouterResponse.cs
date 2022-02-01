namespace Domain.DomainModels
{
    public class ICSMessageRouterResponse
    {
        public ICSMessageRouterResponseDetails Response { get; set; }
    }

    public class ICSMessageRouterResponseDetails
    {
        public string Message { get; set; }
        public string MessageID { get; set; }
        public string MessageCode { get; set; }
    }
}

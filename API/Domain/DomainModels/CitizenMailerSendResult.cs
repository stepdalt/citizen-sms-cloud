namespace Domain.DomainModels
{
    public class CitizenCommunicateSendResult
    {
        public ICSMessageRouterResponse Response { get; private set; }
        public string Message { get; private set; }
        public string CorrelationId { get; private set; }
        public string To { get; private set; }
        public string Bcc { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public CitizenCommunicateSendResult(ICSMessageRouterResponse response,
            string message, string correlationId, string to, string bcc)
        {
            Response = response;
            Message = message;
            CorrelationId = correlationId;
            To = to;
            Bcc = bcc;
        }

        /// <summary>
        /// Use service response to determine the success of the operation.
        /// </summary>
        public bool IsSuccess
        {
            get
            {
                if (Response == null || Response.Response == null)
                    return false;

                return Response.Response.MessageCode == "200";
            }
        }
    }
}

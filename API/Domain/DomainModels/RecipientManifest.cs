using Domain.Utilities;
using System.Collections.Generic;

namespace Domain.DomainModels
{
    public class RecipientManifest
    {
        public string Path { get; set; }
        public List<Recipient> Recipients { get; private set; } = new List<Recipient>();

        public void AddRecipient(Recipient recipient)
        {
            Recipients.Add(recipient);
        }
    }

    public class Recipient
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public bool SendSuccess { get; private set; } = false;
        public string SendMessage { get; private set; }
        public string SendMessageCode { get; private set; }
        public string SendMessageID { get; private set; }
        public string SendException { get; private set; }
        public string SendCorrelationId { get; private set; }
        public string To { get; private set; }
        public string Bcc { get; private set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public Recipient(string firstName, string lastName, string email)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
        }

        public void PopulateSendResults(CitizenCommunicateSendResult result)
        {
            SendSuccess = result.IsSuccess;
            SendMessage = result?.Response?.Response.Message;
            SendMessageCode = result?.Response?.Response.MessageCode;
            SendMessageID = result?.Response?.Response.MessageID;
            SendException = result?.Message;
            SendCorrelationId = result?.CorrelationId;
            To = result?.To;
            Bcc = result?.Bcc;
        }

        public override string ToString()
        {
            return CsvUtils.PrepareCSVLine(new string[]
            {
                Email, FirstName, LastName,
                SendSuccess.ToString(), SendMessage, SendMessageCode, SendMessageID,
                SendException, SendCorrelationId,
                To, Bcc
            });
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DomainModels
{
    public class SMSMessage
    {
        public string Message { get; set; }
        public string Arn { get; set; }
    }

    public class SMSSubscription
    {
        public string PhoneNumber { get; set; }
        public string Arn { get; set; }
    }

    public class SMSTopic
    {
        public string Name { get; set; }
        public string Arn { get; set; }
    }
}

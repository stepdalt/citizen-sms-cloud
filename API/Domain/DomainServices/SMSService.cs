using Amazon.Runtime;
using Amazon.SimpleNotificationService;
using CoC.Blacksmith.Common;
using Domain.ServiceProviders;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DomainServices
{
    /**
    * Wrapper service layer for SMS functions
    */

    public interface ISMSService
    {
        string CreateSNSTopic(string name);

        void DeleteSNSTopic(string topicArn);

        string SubscribeToTopic(string topicArn, string protocol, string endpoint);

        void UnsubscribeFromTopic(string subscriptionArn);

        void PublishMessage(string topicArn, string message);

        List<string> GetTopicList();

        List<string> GetSubscriptionList();

        List<string> GetSubscriptionList(string topicArn);
    }
    
    public class SMSService : ISMSService
    {
        private readonly SMSProvider _sMSProvider;
        private readonly IKeyVaultService _keyvaultService;
        private readonly AmazonSimpleNotificationSer‌​viceClient _client;
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<SMSService>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public SMSService(SMSProvider sMSProvider, IKeyVaultService keyvaultService)
        {
            _sMSProvider = sMSProvider;
            _keyvaultService = keyvaultService;

            var creds = _keyvaultService.GetKeyVaultCredentials().Result.Split('|');
            var awsCredentials = new BasicAWSCredentials(creds[0], creds[1]);
            this._client = new AmazonSimpleNotificationSer‌​viceClient(awsCreden‌​tials, Amazon.RegionEndpoint.USWest2);
        }

        public string CreateSNSTopic(string name)
        {
            return _sMSProvider.CreateSNSTopic(this._client, name);
        }

        public void DeleteSNSTopic(string topicArn)
        {
            _sMSProvider.DeleteSNSTopic(this._client, topicArn);
        }

        public string SubscribeToTopic(string topicArn, string protocol, string endpoint)
        {
            return _sMSProvider.SubscribeToTopic(this._client, topicArn, protocol, endpoint);
        }

        public void UnsubscribeFromTopic(string subscriptionArn)
        {
            _sMSProvider.UnsubscribeFromTopic(this._client, subscriptionArn);
        }

        public void PublishMessage(string topicArn, string message)
        {
            _sMSProvider.PublishMessage(this._client, topicArn, message);
        }

        public List<string> GetTopicList()
        {
            return _sMSProvider.GetTopicList(this._client);
        }

        public List<string> GetSubscriptionList()
        {
            return _sMSProvider.GetSubscriptionList(this._client);
        }

        public List<string> GetSubscriptionList(string topicArn)
        {
            return _sMSProvider.GetSubscriptionListByTopic(this._client, topicArn);
        }
    }
}

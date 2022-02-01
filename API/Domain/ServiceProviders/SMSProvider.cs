using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using CoC.Blacksmith.Common;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ServiceProviders
{
    /**
     * Services provide communication with amazon webservices to preform SMS functions
     */ 
    
    public class SMSProvider
    {
        private readonly ILogger _logger = BlacksmithLogger.CreateLogger<SMSProvider>();

        /// <summary>
        /// Constructor.
        /// </summary>
        public SMSProvider()
        {

        }

        public string CreateSNSTopic(AmazonSimpleNotificationServiceClient snsClient, string topicName)
        {
            //create a new SNS topic
            CreateTopicRequest createTopicRequest = new CreateTopicRequest(topicName);
            CreateTopicResponse createTopicResponse = snsClient.CreateTopic(createTopicRequest);
            //get request id for CreateTopicRequest from SNS metadata		
            return createTopicResponse.TopicArn;
        }

        public void DeleteSNSTopic(AmazonSimpleNotificationServiceClient snsClient, string topicArn)
        {
            snsClient.DeleteTopic(topicArn);
        }

        public string SubscribeToTopic(AmazonSimpleNotificationServiceClient snsClient, string topicArn, string protocol, string endpoint)
        {
            SubscribeRequest subscribeRequest = new SubscribeRequest(topicArn, protocol, endpoint);
            SubscribeResponse subscribeResponse = snsClient.Subscribe(subscribeRequest);
            return subscribeResponse.SubscriptionArn;
        }

        public void UnsubscribeFromTopic(AmazonSimpleNotificationServiceClient snsClient, string subscriptionArn)
        {
            snsClient.Unsubscribe(subscriptionArn);
        }

        public void PublishMessage(AmazonSimpleNotificationServiceClient snsClient, string topicArn, string message)
        {
            message = message.Replace("\\n", "\n");
            PublishRequest pubRequest = new PublishRequest();
            pubRequest.Message = message;
            pubRequest.TopicArn = topicArn;
            PublishResponse pubResponse = snsClient.Publish(pubRequest);
        }

        public List<string> GetTopicList(AmazonSimpleNotificationServiceClient snsClient)
        {
            var topics = snsClient.ListTopics();
            var topicList = new List<string>();

            if (topics.Topics.Any())
            {
                foreach (var topic in topics.Topics)
                {
                    topicList.Add(topic.TopicArn);
                }
            }
            return topicList;
        }

        public List<string> GetSubscriptionList(AmazonSimpleNotificationServiceClient snsClient)
        {
            var subscriptions = snsClient.ListSubscriptions();
            var subscriptionList = new List<string>();
            AddSubscriptionsToList(subscriptionList, subscriptions.Subscriptions);

            while (!string.IsNullOrWhiteSpace(subscriptions.NextToken))
            {
                subscriptions = snsClient.ListSubscriptions(subscriptions.NextToken);
                AddSubscriptionsToList(subscriptionList, subscriptions.Subscriptions);
            }
            
            return subscriptionList;
        }

        protected void AddSubscriptionsToList(List<string> subscriptionList, List<Subscription> subscriptions)
        {
            if (subscriptions.Any())
            {
                foreach (var subscription in subscriptions)
                {
                    subscriptionList.Add(subscription.SubscriptionArn);
                }
            }
        }

        public List<string> GetSubscriptionListByTopic(AmazonSimpleNotificationServiceClient snsClient, string topicArn)
        {
            var subscriptions = snsClient.ListSubscriptionsByTopic(topicArn);
            var subscriptionList = new List<string>();
            AddSubscriptionsToList(subscriptionList, subscriptions.Subscriptions);

            while (!string.IsNullOrWhiteSpace(subscriptions.NextToken))
            {
                subscriptions = snsClient.ListSubscriptionsByTopic(topicArn, subscriptions.NextToken);
                AddSubscriptionsToList(subscriptionList, subscriptions.Subscriptions);
            }

            return subscriptionList; ;
        }
    }
}

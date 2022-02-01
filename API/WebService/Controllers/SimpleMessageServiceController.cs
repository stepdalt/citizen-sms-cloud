using Domain.DomainModels;
using Domain.DomainServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebService.Controllers
{
    /// <summary>
    /// SMS Controller
    /// </summary>
    [Route("api/[controller]")]
    public class SimpleMessageServiceController : Controller
    {
        private readonly ILogger _logger;
        private readonly ISMSService _smsService;

        public SimpleMessageServiceController(ILogger<SimpleMessageServiceController> logger, ISMSService smsService)
        {
            _logger = logger;
            _smsService = smsService;
        }

        [HttpGet("topic")]
        public IActionResult GetTopic()
        {
            return Ok(_smsService.GetTopicList());
        }

        [HttpGet("subscription")]
        public IActionResult GetSubscriptionAll()
        {
            return Ok(_smsService.GetSubscriptionList());
        }

        [HttpGet("subscription/{topicArn}")]
        public IActionResult GetSubscription(string topicArn)
        {
            return Ok(_smsService.GetSubscriptionList(topicArn));
        }

        [HttpPost()]
        [ProducesResponseType(typeof(long), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> PostMessage([FromBody] SMSMessage message)
        {
            _smsService.PublishMessage(message.Arn, message.Message);
            return Ok("Message sent");
        }

        [HttpPost("subscription/mass")]
        [ProducesResponseType(typeof(long), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> PostMassSubscription([FromBody] List<SMSSubscription> subscriptions)
        {
            foreach (var subscription in subscriptions)
            {
                _smsService.SubscribeToTopic(subscription.Arn, "sms", subscription.PhoneNumber);
            }
            return Ok(subscriptions.Count);
        }

        [HttpPost("subscription")]
        [ProducesResponseType(typeof(long), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> PostSubscription([FromBody] SMSSubscription subscription)
        {
            subscription.Arn =_smsService.SubscribeToTopic(subscription.Arn, "sms", subscription.PhoneNumber);
            return Ok(subscription);
        }

        [HttpPost("topic")]
        [ProducesResponseType(typeof(long), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> PostTopic([FromBody] SMSTopic topic)
        {
            topic.Arn = _smsService.CreateSNSTopic(topic.Name);
            return Ok(topic);
        }

        [HttpDelete("topic/{arn}")]
        [ProducesResponseType(typeof(long), 200)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> DeleteTopic(string arn)
        {
            _smsService.DeleteSNSTopic(arn);
            return NoContent();
        }

        [HttpDelete("subscription/mass")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> DeleteMassSubscription([FromBody] List<string> arns)
        {
            foreach (var arn in arns)
            {
                _smsService.UnsubscribeFromTopic(arn);
            }
            return Ok(arns.Count);
        }

        [HttpDelete("subscription/{arn}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> DeleteSubscription(string arn)
        {
            _smsService.UnsubscribeFromTopic(arn);
            return NoContent();
        }
    }
}

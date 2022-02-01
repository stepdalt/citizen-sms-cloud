namespace Domain.DomainModels.EmailTemplates
{
    public class FairEntryEmailTemplate : IEmailTemplate
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public FairEntryEmailTemplate()
        {
        }

        public string Subject()
        {
            return "Sample";
        }

        public string Body()
        {
            return $@"Sample";
        }

        private string _disclaimer = $@"Sample";
    }
}

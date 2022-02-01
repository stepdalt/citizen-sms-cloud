namespace Domain.DomainModels.EmailTemplates
{
    public interface IEmailTemplate
    {
        string Subject();
        string Body();
    }
}

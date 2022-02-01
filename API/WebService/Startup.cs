using CoC.Blacksmith.Common;
using CoC.Blacksmith.DataAccess;
using CoC.Blacksmith.Exceptions.Middleware;
using CoC.Blacksmith.Http.Utilities.Environments;
using CoC.Blacksmith.Http.Utilities.Integration;
using CoC.Blacksmith.Http.Utilities.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;
using System.Collections.Generic;

namespace WebService
{
    /// <summary>
    /// Configure the application components and registrations on startup.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Configure the application on startup.
        /// </summary>
        public Startup(IConfiguration config, IHostingEnvironment env)
        {
            Configuration = config;
            Environment = env;
        }

        /// <summary>
        /// Application configuration from appsettings.(*.)json.
        /// </summary>
        public IConfiguration Configuration { get; private set; }

        /// <summary>
        /// Current runtime environment, generally determined by an environment variable.
        /// </summary>
        public IHostingEnvironment Environment { get; private set; }

        /// <summary>
        /// Information that describes the application.
        /// </summary>
        public ApplicationInfo AppInfo { get; private set; }

        /// <summary>
        /// Configuration options that alter the behaviour of the API across runtime environments.
        /// </summary>
        public ApiConfiguration ApiConfig { get; private set; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Debug($"Starting...");

            //
            // Configure application-specific services.

            AppRegistration.ConfigureService(services, Configuration, Environment);

            //
            // Application information

            AppInfo = new ApplicationInfo();
            Configuration.GetSection("ApplicationInfo").Bind(AppInfo);

            services.Configure<ApplicationInfo>(Configuration.GetSection("ApplicationInfo"));

            //
            // Grab the API settings for middleware configuration.

            ApiConfig = new ApiConfiguration();
            Configuration.GetSection("ApiConfiguration").Bind(ApiConfig);

            //
            // Configure common application services.

            services.AddCors();
            services.AddOptions();
            services.AddHttpClient();
            services.AddHttpContextAccessor();
            services.AddHttpCommonRequestParameters();
            services.AddScoped(sp => sp.GetService<IHttpContextAccessor>().HttpContext.User);
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.RequireHeaderSymmetry = false;
            });

            //
            // databases and integrations

            services.AddDatabaseConnectionFactory(Configuration.GetSection(DataAccessKeys.DatabasesConfigKey));
            services.AddIntegrations(Configuration.GetSection(HttpKeyValues.IntegrationsConfigKey));

            //
            // Configure MVC services with a few named caches and a no-cache/no-store default.

            services
                .AddMvc(options =>
                {
                    if (ApiConfig.EnableExplicitDefaultCacheHeader)
                    {
                        options.Filters.Add(new ResponseCacheAttribute() { NoStore = true, Location = ResponseCacheLocation.None });
                    }
                })
                .AddXmlSerializerFormatters();

            //
            // Configure swagger with authentication.

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(AppInfo.Version, new Info { Title = AppInfo.Name, Version = $"{AppInfo.Version} ({Environment.EnvironmentName})" });

                //
                // basic auth

                c.AddSecurityDefinition("basic", new BasicAuthScheme
                {
                    Description = "Basic Authentication",
                    Type = "basic"
                });

                //
                // bearer auth

                c.AddSecurityDefinition("bearer", new ApiKeyScheme
                {
                    Description = "Token Authentication",
                    Type = "apiKey",
                    In = "header",
                    Name = "Authorization"
                });

                //
                // security requirements

                c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
                {
                    {"basic", new string[] { } },
                    {"bearer", new string[] { } }
                });
            });

        }

        /// <summary>
        /// Configure the application middleware.
        /// Middleware is executed on each request prior to the execution of application Controller code.
        /// Note: order of the configuration is important in this method. The configured middleware will execute in this coded order in the runtime environment.
        /// </summary>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //
            // Configure global exception handling. This should always happen first in request pipeline.

            app.UseGlobalExceptionHandler(ApiConfig.EnableExceptionShielding);

            if (ApiConfig.EnableExceptionShielding)
            {
                if (!env.IsSandbox() && !env.IsDevelopment())
                {
                    Log.Warning($"The dev global exception handler is enabled. This should only be enabled beyond the dev environment in special cases");
                }
            }

            //
            // Configure the Correlation Id middleware.

            app.UseHttpLogContextMiddleware();

            //
            // Configure the CORS middleware.

            if (ApiConfig.EnableCors)
            {
                app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
                if (!env.IsEnvironment("Sandbox"))
                {
                    Log.Warning($"The allow cors settings are enabled. This should only be enabled beyond the sandbox environment in special cases");
                }
            }

            //
            // Configure the Swagger middleware.

            if (ApiConfig.EnableSwagger)
            {
                // enable swagger for interactive API documentation
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint($@"/swagger/{AppInfo.Version}/swagger.json", AppInfo.Name);
                });
                if (!env.IsEnvironment("Sandbox") && !env.IsDevelopment())
                {
                    Log.Warning($"Swagger is enabled. This should only be enabled beyond the dev environment in special cases.");
                }
            }

            //
            // Configure additional app-specific middleware.

            AppRegistration.AddMiddleware(app, Configuration, Environment);

            //
            // Configure MVC for common routing and controller capabilities.

            app.UseAuthentication();
            app.UseMvc();

            //
            // Done! End of middleware configuration.

            Log.Debug($"Startup completed.");
        }
    }
}
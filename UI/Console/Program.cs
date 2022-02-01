using CoC.Blacksmith.Common;
using CoC.Blacksmith.DataAccess;
using CoC.Blacksmith.Http.Utilities.Integration;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using System.IO;
using System.Reflection;

namespace ConsoleUI
{
    /// <summary>
    /// This is the main entry into the console application.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Access the configured application services.
        /// </summary>
        public static IServiceProvider ServiceProvider { get; private set; }

        /// <summary>
        /// Name of the current runtime environment.
        /// </summary>
        public static string EnvironmentName { get; private set; }

        /// <summary>
        /// Information about the application.
        /// </summary>
        public static ApplicationInfo AppInfo { get; private set; }

        /// <summary>
        /// Directory the application was started under.
        /// </summary>
        public static string StartDirectory { get; private set; }

        private static ConsoleOptions _consoleOptions;
        private static IConfigurationRoot Configuration;

        /// <summary>
        /// Main entry into the application.
        /// </summary>
        static void Main(string[] args)
        {
            var envVar = "ASPNETCORE_ENVIRONMENT";
            StartDirectory = Directory.GetCurrentDirectory();
            EnvironmentName = Environment.GetEnvironmentVariable(envVar);

            if (string.IsNullOrEmpty(EnvironmentName))
            {
                Console.WriteLine($"The {envVar} environment variable must be set. Exiting...");
                Environment.Exit(1);
            }

            var originalDirectory = Environment.CurrentDirectory;
            if (!IsSandbox(EnvironmentName))
            {
                // Note: writing logs or other files to the application directory
                // on servers is not recommended, so please avoid doing so.
                //
                // The code below changes the context to the application directory,
                // so as to provide the expected directory context for the few
                // cases where writing to the app's directory is useful.
                //
                // Be aware that running in a non-sandbox context on the developer machine
                // will place the files in the executable's directory (e.g. bin/Debug/..).

                Environment.CurrentDirectory = GetAppDirectory();
            }

            Setup(EnvironmentName);

            Console.WriteLine($"** {AppInfo.Name} {AppInfo.Version} **");
            Console.WriteLine();
            Console.WriteLine($"* Application directory: {GetAppDirectory()}");
            Console.WriteLine($"* Current environment: {EnvironmentName}");
            Console.WriteLine();
            Console.WriteLine("------------------");
            Console.WriteLine();

            var app = new CommandLineApplication();
            app.Name = typeof(Program).GetTypeInfo().Assembly.GetName().Name;
            app.HelpOption("-?|-h|--help");

            app.ConfigureCommands();

            app.Execute(args);

            Console.WriteLine();

            if (!_consoleOptions.SilentExit)
            {
                Console.Write("Press <enter> to exit.");
                Console.ReadLine();
            }

            Environment.CurrentDirectory = originalDirectory;
        }

        /// <summary>
        /// Obtain the directory in which this executable resides.
        /// </summary>
        public static string GetAppDirectory()
        {
            return Path.GetDirectoryName(typeof(Program).GetTypeInfo().Assembly.Location);
        }

        /// <summary>
        /// Read the configuration and build the applicable application containers.
        /// </summary>
        private static void Setup(string environmentName)
        {
            //
            // initialize configuration

            var builder = new ConfigurationBuilder()
                .SetBasePath(GetAppDirectory())
                .AddJsonFile($"appsettings.json", true, true)
                .AddJsonFile($"appsettings.{environmentName}.json", true, true) // override settings from appsettings.json
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            //
            // set up dependency injection

            var services = new ServiceCollection();
            services.AddAppServices(Configuration, EnvironmentName);

            //
            // Application information

            AppInfo = new ApplicationInfo();
            Configuration.GetSection("ApplicationInfo").Bind(AppInfo);
            services.AddDatabaseConnectionFactory(Configuration.GetSection(DataAccessKeys.DatabasesConfigKey));
            services.AddIntegrations(Configuration.GetSection(HttpKeyValues.IntegrationsConfigKey));
            services.Configure<ApplicationInfo>(Configuration.GetSection("ApplicationInfo"));

            ServiceProvider = services.BuildServiceProvider();

            //
            // Console options

            _consoleOptions = new ConsoleOptions();
            Configuration.GetSection("ConsoleOptions").Bind(_consoleOptions);

            //
            // configure logging

            var _serilogger = new LoggerConfiguration()
                .ReadFrom.ConfigurationSection(Configuration.GetSection("Serilog"))
                .WriteTo.Console()
                .CreateLogger();

            _serilogger.Information($"Starting console app...");

            BlacksmithLogger.LoggerFactory
                .AddSerilog(_serilogger);
        }

        /// <summary>
        /// Determine whether the specified environment is sandbox (i.e. a developer's machine).
        /// </summary>
        private static bool IsSandbox(string environmentName)
        {
            return environmentName.ToLower() == "sandbox";
        }
    }

    /// <summary>
    /// Console options.
    /// </summary>
    public class ConsoleOptions
    {
        /// <summary>
        /// Silently exit the application.
        /// Useful in development to keep the console window from closing.
        /// </summary>
        public bool SilentExit { get; set; } = true;
    }
}
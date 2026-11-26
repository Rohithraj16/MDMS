using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MDMS.Api.Data;

public sealed class MDMSDbContextFactory : IDesignTimeDbContextFactory<MDMSDbContext>
{
    public MDMSDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddUserSecrets<MDMSDbContextFactory>(optional: true)
            .AddEnvironmentVariables()
            .Build();
        var connectionString = configuration.GetConnectionString("MDMS");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Set ConnectionStrings:MDMS using .NET user-secrets or an environment variable before running EF Core migrations."
            );
        }

        var options = new DbContextOptionsBuilder<MDMSDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new MDMSDbContext(options);
    }
}

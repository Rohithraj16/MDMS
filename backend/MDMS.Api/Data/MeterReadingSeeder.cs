using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Data;

public static class MeterReadingSeeder
{
    public static async Task SeedAsync(
        IServiceProvider services,
        CancellationToken cancellationToken = default
    )
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<MDMSDbContext>();

        if (await dbContext.MeterReadings.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.MeterReadings.AddRangeAsync(
            SeedData.MeterReadings,
            cancellationToken
        );
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

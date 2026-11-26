using System.Globalization;
using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/zones/{zoneId:int}/dashboard")]
public sealed class ZoneDashboardController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ZoneDashboardResponse>> GetDashboard(
        int zoneId,
        [FromQuery] string period = "weekly",
        CancellationToken cancellationToken = default
    )
    {
        var isMonthly = string.Equals(period, "monthly", StringComparison.OrdinalIgnoreCase);
        var isWeekly = string.Equals(period, "weekly", StringComparison.OrdinalIgnoreCase);

        if (!isWeekly && !isMonthly)
        {
            return BadRequest("Period must be either 'weekly' or 'monthly'.");
        }

        var zone = await dbContext.Zones
            .AsNoTracking()
            .Where(item => item.Id == zoneId)
            .Select(item => new { item.Id, item.Name })
            .SingleOrDefaultAsync(cancellationToken);

        if (zone is null)
        {
            return NotFound();
        }

        var meters = await dbContext.Meters
            .AsNoTracking()
            .Where(meter => meter.Customer.ZoneId == zoneId)
            .Select(meter => new { meter.Id, meter.Status })
            .ToListAsync(cancellationToken);

        var pendingAlerts = await dbContext.Alerts
            .CountAsync(
                alert => alert.Meter.Customer.ZoneId == zoneId && alert.Status == "Pending",
                cancellationToken
            );

        var latestReadingDate = await dbContext.MeterReadings
            .Where(reading => reading.Meter.Customer.ZoneId == zoneId)
            .MaxAsync(reading => (DateOnly?)reading.ReadingDate, cancellationToken);

        var periodDays = isMonthly ? 30 : 7;
        var buckets = new List<ConsumptionBucketResponse>();
        var totalUsage = 0m;

        if (latestReadingDate.HasValue)
        {
            var startDate = latestReadingDate.Value.AddDays(-(periodDays - 1));
            var readings = await dbContext.MeterReadings
                .AsNoTracking()
                .Where(reading =>
                    reading.Meter.Customer.ZoneId == zoneId
                    && reading.ReadingDate >= startDate.AddDays(-1)
                    && reading.ReadingDate <= latestReadingDate.Value
                )
                .OrderBy(reading => reading.MeterId)
                .ThenBy(reading => reading.ReadingDate)
                .Select(reading => new
                {
                    reading.MeterId,
                    reading.ReadingDate,
                    reading.ReadingKwh,
                })
                .ToListAsync(cancellationToken);

            var dailyUsage = new decimal[periodDays];
            foreach (var meterReadings in readings.GroupBy(reading => reading.MeterId))
            {
                var previousReading = (decimal?)null;
                var previousDate = (DateOnly?)null;

                foreach (var reading in meterReadings)
                {
                    if (
                        previousReading.HasValue
                        && previousDate.HasValue
                        && reading.ReadingDate >= startDate
                    )
                    {
                        var usage = reading.ReadingKwh - previousReading.Value;
                        if (usage >= 0)
                        {
                            dailyUsage[(reading.ReadingDate.DayNumber - startDate.DayNumber)] += usage;
                        }
                    }

                    previousReading = reading.ReadingKwh;
                    previousDate = reading.ReadingDate;
                }
            }

            var bucketSize = isMonthly ? 7 : 1;
            for (var bucketStart = 0; bucketStart < periodDays; bucketStart += bucketSize)
            {
                var bucketUsage = dailyUsage
                    .Skip(bucketStart)
                    .Take(Math.Min(bucketSize, periodDays - bucketStart))
                    .Sum();
                totalUsage += bucketUsage;

                var label = isMonthly
                    ? $"Week {bucketStart / bucketSize + 1}"
                    : startDate.AddDays(bucketStart).ToString("ddd", CultureInfo.InvariantCulture);

                buckets.Add(new ConsumptionBucketResponse(label, decimal.Round(bucketUsage, 2)));
            }
        }

        var averageDailyUsage = meters.Count == 0
            ? 0m
            : totalUsage / periodDays / meters.Count;

        return Ok(
            new ZoneDashboardResponse(
                zone.Id,
                zone.Name,
                meters.Count(meter => meter.Status == "Active"),
                decimal.Round(averageDailyUsage, 2),
                pendingAlerts,
                isMonthly ? "monthly" : "weekly",
                latestReadingDate,
                buckets
            )
        );
    }
}

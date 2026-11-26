using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/zones/{zoneId:int}/reports")]
public sealed class ZoneReportsController(MDMSDbContext dbContext) : ControllerBase
{
    private const int MaximumReportDays = 366;

    [HttpGet("consumption")]
    public async Task<ActionResult<ZoneReportResponse>> GetConsumptionReport(
        int zoneId,
        [FromQuery] DateOnly fromDate,
        [FromQuery] DateOnly toDate,
        [FromQuery] string? meterNumber,
        CancellationToken cancellationToken
    )
    {
        if (fromDate > toDate)
        {
            return BadRequest("The start date must be on or before the end date.");
        }

        var dayCount = toDate.DayNumber - fromDate.DayNumber + 1;
        if (dayCount > MaximumReportDays)
        {
            return BadRequest($"The report range cannot exceed {MaximumReportDays} days.");
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

        var metersQuery = dbContext.Meters
            .AsNoTracking()
            .Where(meter => meter.Customer.ZoneId == zoneId);

        if (!string.IsNullOrWhiteSpace(meterNumber))
        {
            var normalizedMeterNumber = meterNumber.Trim();
            metersQuery = metersQuery.Where(meter => meter.MeterNumber == normalizedMeterNumber);
        }

        var meters = await metersQuery
            .OrderBy(meter => meter.MeterNumber)
            .Select(meter => new
            {
                meter.Id,
                meter.MeterNumber,
                meter.Status,
                CustomerName = meter.Customer.FullName,
            })
            .ToListAsync(cancellationToken);

        var meterIds = meters.Select(meter => meter.Id).ToArray();
        var firstReadingDate = fromDate == DateOnly.MinValue ? fromDate : fromDate.AddDays(-1);
        var readings = await dbContext.MeterReadings
            .AsNoTracking()
            .Where(reading =>
                meterIds.Contains(reading.MeterId)
                && reading.ReadingDate >= firstReadingDate
                && reading.ReadingDate <= toDate
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

        var readingsByMeter = readings
            .GroupBy(reading => reading.MeterId)
            .ToDictionary(group => group.Key, group => group.ToArray());
        var dailyUsage = new decimal[dayCount];
        var meterSummaries = new List<MeterUsageSummaryResponse>(meters.Count);

        foreach (var meter in meters)
        {
            decimal totalUsage = 0m;
            decimal? previousReading = null;
            decimal? latestReading = null;

            if (readingsByMeter.TryGetValue(meter.Id, out var meterReadings))
            {
                foreach (var reading in meterReadings)
                {
                    latestReading = reading.ReadingKwh;

                    if (reading.ReadingDate >= fromDate && previousReading.HasValue)
                    {
                        var usage = reading.ReadingKwh - previousReading.Value;
                        if (usage >= 0)
                        {
                            totalUsage += usage;
                            dailyUsage[reading.ReadingDate.DayNumber - fromDate.DayNumber] += usage;
                        }
                    }

                    previousReading = reading.ReadingKwh;
                }
            }

            meterSummaries.Add(
                new MeterUsageSummaryResponse(
                    meter.MeterNumber,
                    meter.CustomerName,
                    meter.Status,
                    decimal.Round(totalUsage, 2),
                    decimal.Round(totalUsage / dayCount, 2),
                    latestReading
                )
            );
        }

        var trend = Enumerable.Range(0, dayCount)
            .Select(index =>
                new DailyUsageResponse(
                    fromDate.AddDays(index),
                    decimal.Round(dailyUsage[index], 2)
                )
            )
            .ToArray();
        var totalZoneUsage = meterSummaries.Sum(meter => meter.TotalUsageKwh);

        return Ok(
            new ZoneReportResponse(
                zone.Id,
                zone.Name,
                fromDate,
                toDate,
                totalZoneUsage,
                decimal.Round(totalZoneUsage / dayCount, 2),
                meters.Count,
                trend,
                meterSummaries
            )
        );
    }
}

namespace MDMS.Api.Contracts;

public sealed record ZoneReportResponse(
    int ZoneId,
    string ZoneName,
    DateOnly FromDate,
    DateOnly ToDate,
    decimal TotalUsageKwh,
    decimal AverageDailyUsageKwh,
    int MeterCount,
    IReadOnlyList<DailyUsageResponse> Trend,
    IReadOnlyList<MeterUsageSummaryResponse> Meters
);

public sealed record DailyUsageResponse(DateOnly Date, decimal UsageKwh);

public sealed record MeterUsageSummaryResponse(
    string MeterNumber,
    string CustomerName,
    string Status,
    decimal TotalUsageKwh,
    decimal AverageDailyUsageKwh,
    decimal? LatestReadingKwh
);

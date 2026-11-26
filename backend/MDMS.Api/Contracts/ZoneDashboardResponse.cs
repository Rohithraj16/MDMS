namespace MDMS.Api.Contracts;

public sealed record ZoneDashboardResponse(
    int ZoneId,
    string ZoneName,
    int ActiveMeters,
    decimal AverageDailyUsageKwh,
    int PendingAlerts,
    string Period,
    DateOnly? DataThrough,
    IReadOnlyList<ConsumptionBucketResponse> Consumption
);

public sealed record ConsumptionBucketResponse(string Label, decimal UsageKwh);

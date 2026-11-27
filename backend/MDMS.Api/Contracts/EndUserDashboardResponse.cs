namespace MDMS.Api.Contracts;

public sealed record DashboardConsumptionPointResponse(string Label, decimal Value);

public sealed record EndUserDashboardResponse(
    string UserName,
    decimal CurrentConsumption,
    decimal CurrentBill,
    int ActiveMeters,
    int UnreadAlerts,
    IReadOnlyList<DashboardConsumptionPointResponse> Consumption
);

namespace MDMS.Api.Contracts;

public sealed record ZoneAlertResponse(
    string AlertNumber,
    string Title,
    string Severity,
    string Status,
    DateOnly CreatedDate,
    string MeterNumber,
    string CustomerName
);

public sealed record UpdateZoneAlertStatusRequest(string Status);

namespace MDMS.Api.Contracts;

public sealed record CustomerDetailsResponse(
    int Id,
    string AccountNumber,
    string FullName,
    int ZoneId,
    string Zone,
    IReadOnlyList<CustomerMeterResponse> Meters
);

public sealed record CustomerMeterResponse(
    string Id,
    string Status,
    decimal ReadingKwh,
    DateOnly LastUpdated
);

namespace MDMS.Api.Contracts;

public sealed record MeterDetailsResponse(
    string Id,
    string Zone,
    string Status,
    decimal ReadingKwh,
    DateOnly LastUpdated,
    int CustomerId,
    string AccountNumber,
    string CustomerName
);

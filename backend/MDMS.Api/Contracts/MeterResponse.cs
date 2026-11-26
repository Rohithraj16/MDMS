namespace MDMS.Api.Contracts;

public sealed record MeterResponse(
    string Id,
    string Zone,
    string Status,
    decimal ReadingKwh,
    DateOnly LastUpdated
);

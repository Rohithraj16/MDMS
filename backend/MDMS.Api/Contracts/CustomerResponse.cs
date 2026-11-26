namespace MDMS.Api.Contracts;

public sealed record CustomerResponse(
    int Id,
    string AccountNumber,
    string FullName,
    int ZoneId,
    string Zone,
    int MeterCount
);

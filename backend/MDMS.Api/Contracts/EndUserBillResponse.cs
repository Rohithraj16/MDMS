namespace MDMS.Api.Contracts;

public sealed record EndUserBillResponse(
    string Id,
    DateOnly BillingMonth,
    decimal Amount,
    DateOnly DueDate,
    string Status,
    DateOnly? PaidOn
);

public sealed record BillDayResponse(
    DateOnly Date,
    decimal ReadingKwh,
    decimal ConsumptionKwh,
    decimal Cost
);

public sealed record EndUserBillDetailsResponse(
    EndUserBillResponse Bill,
    string MeterNumber,
    IReadOnlyList<BillDayResponse> Days
);

public sealed record MeterUsagePointResponse(
    string Label,
    DateOnly Date,
    decimal ReadingKwh,
    decimal ConsumptionKwh,
    string Notes
);

public sealed record MeterDataResponse(
    string MeterNumber,
    IReadOnlyList<MeterUsagePointResponse> Current,
    IReadOnlyList<MeterUsagePointResponse> Previous
);

using System.ComponentModel.DataAnnotations;

namespace MDMS.Api.Contracts;

public sealed record CreateMeterRequest(
    [param: Required]
    [param: StringLength(24, MinimumLength = 4)]
    string MeterNumber,
    [param: Range(1, int.MaxValue)]
    int CustomerId
);

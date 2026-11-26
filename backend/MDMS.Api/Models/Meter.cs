namespace MDMS.Api.Models;

public sealed class Meter
{
    public int Id { get; set; }
    public string MeterNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal ReadingKwh { get; set; }
    public DateOnly LastUpdated { get; set; }
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
}

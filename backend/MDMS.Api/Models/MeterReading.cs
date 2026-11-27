namespace MDMS.Api.Models;

public sealed class MeterReading
{
    public int Id { get; set; }
    public int MeterId { get; set; }
    public DateOnly ReadingDate { get; set; }
    public decimal ReadingKwh { get; set; }
    public Meter Meter { get; set; } = null!;
}

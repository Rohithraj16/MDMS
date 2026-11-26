namespace MDMS.Api.Models;

public sealed class Alert
{
    public int Id { get; set; }
    public string AlertNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateOnly CreatedDate { get; set; }
    public int MeterId { get; set; }
    public Meter Meter { get; set; } = null!;
}

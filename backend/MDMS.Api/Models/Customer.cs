namespace MDMS.Api.Models;

public sealed class Customer
{
    public int Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int ZoneId { get; set; }
    public Zone Zone { get; set; } = null!;
    public ICollection<Meter> Meters { get; set; } = new List<Meter>();
}

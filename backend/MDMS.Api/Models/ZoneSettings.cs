namespace MDMS.Api.Models;

public sealed class ZoneSettings
{
    public int ZoneId { get; set; }
    public decimal HighConsumptionThresholdKwh { get; set; }
    public decimal LowVoltageThresholdVolts { get; set; }
    public decimal HighVoltageThresholdVolts { get; set; }
    public bool EmailNotificationsEnabled { get; set; }
    public bool SmsNotificationsEnabled { get; set; }
    public bool InAppNotificationsEnabled { get; set; }
}

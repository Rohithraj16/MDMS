namespace MDMS.Api.Contracts;

public sealed record ZoneSettingsResponse(
    int ZoneId,
    decimal HighConsumptionThresholdKwh,
    decimal LowVoltageThresholdVolts,
    decimal HighVoltageThresholdVolts,
    bool EmailNotificationsEnabled,
    bool SmsNotificationsEnabled,
    bool InAppNotificationsEnabled
);

public sealed record UpdateZoneSettingsRequest(
    decimal HighConsumptionThresholdKwh,
    decimal LowVoltageThresholdVolts,
    decimal HighVoltageThresholdVolts,
    bool EmailNotificationsEnabled,
    bool SmsNotificationsEnabled,
    bool InAppNotificationsEnabled
);

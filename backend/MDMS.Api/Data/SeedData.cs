using MDMS.Api.Models;

namespace MDMS.Api.Data;

public static class SeedData
{
    private static readonly string[] ZoneNames = ["North", "South", "East", "West"];
    private static readonly string[] MeterStatuses = ["Active", "Maintenance", "Inactive"];
    private static readonly DateOnly ReadingsThrough = new(2026, 11, 25);
    private const int ReadingHistoryDays = 30;

    public static Zone[] Zones =>
    [
        new() { Id = 1, Code = "NTH", Name = ZoneNames[0] },
        new() { Id = 2, Code = "STH", Name = ZoneNames[1] },
        new() { Id = 3, Code = "EST", Name = ZoneNames[2] },
        new() { Id = 4, Code = "WST", Name = ZoneNames[3] },
    ];

    public static Customer[] Customers =>
        Enumerable.Range(1, 48)
            .Select(index => new Customer
            {
                Id = index,
                AccountNumber = $"ACC-{index:0000}",
                FullName = $"Customer {index:0000}",
                ZoneId = ((index - 1) / 12) + 1,
            })
            .ToArray();

    public static Meter[] Meters =>
        Enumerable.Range(1, 48)
            .Select(index => new Meter
            {
                Id = index,
                MeterNumber = $"MTR-{1000 + index:0000}",
                Status = MeterStatuses[(index - 1) % MeterStatuses.Length],
                ReadingKwh = 800m + (index * 37.5m),
                LastUpdated = ReadingsThrough,
                CustomerId = index,
            })
            .ToArray();

    public static ZoneSettings[] ZoneSettings =>
    [
        new()
        {
            ZoneId = 1,
            HighConsumptionThresholdKwh = 15m,
            LowVoltageThresholdVolts = 210m,
            HighVoltageThresholdVolts = 250m,
            EmailNotificationsEnabled = true,
            SmsNotificationsEnabled = true,
            InAppNotificationsEnabled = true,
        },
        new()
        {
            ZoneId = 2,
            HighConsumptionThresholdKwh = 15m,
            LowVoltageThresholdVolts = 210m,
            HighVoltageThresholdVolts = 250m,
            EmailNotificationsEnabled = true,
            SmsNotificationsEnabled = true,
            InAppNotificationsEnabled = true,
        },
        new()
        {
            ZoneId = 3,
            HighConsumptionThresholdKwh = 15m,
            LowVoltageThresholdVolts = 210m,
            HighVoltageThresholdVolts = 250m,
            EmailNotificationsEnabled = true,
            SmsNotificationsEnabled = true,
            InAppNotificationsEnabled = true,
        },
        new()
        {
            ZoneId = 4,
            HighConsumptionThresholdKwh = 15m,
            LowVoltageThresholdVolts = 210m,
            HighVoltageThresholdVolts = 250m,
            EmailNotificationsEnabled = true,
            SmsNotificationsEnabled = true,
            InAppNotificationsEnabled = true,
        },
    ];

    public static Alert[] Alerts =>
    [
        new() { Id = 1, AlertNumber = "ALT-1001", Title = "High consumption detected", Severity = "High", Status = "Pending", CreatedDate = ReadingsThrough, MeterId = 1 },
        new() { Id = 2, AlertNumber = "ALT-1002", Title = "Meter communication loss", Severity = "Critical", Status = "Pending", CreatedDate = ReadingsThrough.AddDays(-1), MeterId = 2 },
        new() { Id = 3, AlertNumber = "ALT-1003", Title = "Voltage fluctuation detected", Severity = "Medium", Status = "Resolved", CreatedDate = ReadingsThrough.AddDays(-2), MeterId = 3 },
        new() { Id = 4, AlertNumber = "ALT-1004", Title = "High consumption detected", Severity = "High", Status = "Pending", CreatedDate = ReadingsThrough, MeterId = 13 },
        new() { Id = 5, AlertNumber = "ALT-1005", Title = "Meter communication loss", Severity = "Critical", Status = "Pending", CreatedDate = ReadingsThrough.AddDays(-1), MeterId = 14 },
        new() { Id = 6, AlertNumber = "ALT-1006", Title = "Voltage fluctuation detected", Severity = "Medium", Status = "Resolved", CreatedDate = ReadingsThrough.AddDays(-2), MeterId = 15 },
        new() { Id = 7, AlertNumber = "ALT-1007", Title = "High consumption detected", Severity = "High", Status = "Pending", CreatedDate = ReadingsThrough, MeterId = 25 },
        new() { Id = 8, AlertNumber = "ALT-1008", Title = "Meter communication loss", Severity = "Critical", Status = "Pending", CreatedDate = ReadingsThrough.AddDays(-1), MeterId = 26 },
        new() { Id = 9, AlertNumber = "ALT-1009", Title = "Voltage fluctuation detected", Severity = "Medium", Status = "Resolved", CreatedDate = ReadingsThrough.AddDays(-2), MeterId = 27 },
        new() { Id = 10, AlertNumber = "ALT-1010", Title = "High consumption detected", Severity = "High", Status = "Pending", CreatedDate = ReadingsThrough, MeterId = 37 },
        new() { Id = 11, AlertNumber = "ALT-1011", Title = "Meter communication loss", Severity = "Critical", Status = "Pending", CreatedDate = ReadingsThrough.AddDays(-1), MeterId = 38 },
        new() { Id = 12, AlertNumber = "ALT-1012", Title = "Voltage fluctuation detected", Severity = "Medium", Status = "Resolved", CreatedDate = ReadingsThrough.AddDays(-2), MeterId = 39 },
    ];

    public static MeterReading[] MeterReadings =>
        Meters
            .SelectMany(meter =>
                Enumerable.Range(0, ReadingHistoryDays + 1)
                    .Select(daysAgo => new MeterReading
                    {
                        MeterId = meter.Id,
                        ReadingDate = ReadingsThrough.AddDays(-daysAgo),
                        ReadingKwh = meter.ReadingKwh
                            - DailyUsageForMeter(meter.Id) * daysAgo,
                    })
            )
            .ToArray();

    private static decimal DailyUsageForMeter(int meterId) =>
        4m + (meterId % 9) * 0.75m;
}

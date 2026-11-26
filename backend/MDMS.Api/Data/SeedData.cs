using MDMS.Api.Models;

namespace MDMS.Api.Data;

public static class SeedData
{
    private static readonly string[] ZoneNames = ["North", "South", "East", "West"];
    private static readonly string[] MeterStatuses = ["Active", "Maintenance", "Inactive"];

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
                LastUpdated = new DateOnly(2026, 11, 25).AddDays(-(index % 14)),
                CustomerId = index,
            })
            .ToArray();
}

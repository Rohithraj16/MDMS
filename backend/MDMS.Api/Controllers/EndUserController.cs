using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/enduser")]
public sealed class EndUserController(MDMSDbContext dbContext) : ControllerBase
{
    // Phase 1 has no authentication yet, so the demo end user is customer 1.
    private const int DemoCustomerId = 1;

    [HttpGet("dashboard")]
    public async Task<ActionResult<EndUserDashboardResponse>> GetDashboard(
        [FromQuery] string period = "week",
        CancellationToken cancellationToken = default
    )
    {
        if (period is not ("day" or "week" or "month" or "year"))
        {
            return BadRequest("Period must be day, week, month, or year.");
        }

        var customer = await dbContext.Customers
            .AsNoTracking()
            .Where(item => item.Id == DemoCustomerId)
            .Select(item => new
            {
                item.FullName,
                ActiveMeters = item.Meters.Count(meter => meter.Status == "Active"),
            })
            .FirstOrDefaultAsync(cancellationToken);
        if (customer is null)
        {
            return NotFound();
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var currentMonth = new DateOnly(today.Year, today.Month, 1);
        var currentBill = BuildBills(today).First().Amount;
        var currentConsumption = BuildBillDays(
            currentMonth,
            DateTime.DaysInMonth(currentMonth.Year, currentMonth.Month)
        ).Sum(day => day.ConsumptionKwh);
        var unreadCount = BuildNotifications().Count(notification => !notification.IsRead);
        var points = BuildDashboardSeries(period);

        return Ok(new EndUserDashboardResponse(
            customer.FullName,
            currentConsumption,
            currentBill,
            customer.ActiveMeters,
            unreadCount,
            points
        ));
    }

    [HttpGet("bills")]
    public async Task<ActionResult<IReadOnlyList<EndUserBillResponse>>> GetBills(
        CancellationToken cancellationToken
    )
    {
        var customerExists = await dbContext.Customers.AnyAsync(
            customer => customer.Id == DemoCustomerId,
            cancellationToken
        );
        if (!customerExists)
        {
            return NotFound();
        }

        return Ok(BuildBills(DateOnly.FromDateTime(DateTime.UtcNow)));
    }

    [HttpGet("bills/{billId}")]
    public async Task<ActionResult<EndUserBillDetailsResponse>> GetBill(
        string billId,
        CancellationToken cancellationToken
    )
    {
        var bill = BuildBills(DateOnly.FromDateTime(DateTime.UtcNow))
            .FirstOrDefault(item => item.Id == billId);
        if (bill is null)
        {
            return NotFound();
        }

        var meter = await dbContext.Meters
            .AsNoTracking()
            .Where(item => item.CustomerId == DemoCustomerId)
            .OrderBy(item => item.MeterNumber)
            .Select(item => item.MeterNumber)
            .FirstOrDefaultAsync(cancellationToken);
        if (meter is null)
        {
            return NotFound();
        }

        var monthDays = DateTime.DaysInMonth(bill.BillingMonth.Year, bill.BillingMonth.Month);
        var days = BuildBillDays(bill.BillingMonth, monthDays);
        return Ok(new EndUserBillDetailsResponse(bill, meter, days));
    }

    [HttpGet("meter-data")]
    public async Task<ActionResult<MeterDataResponse>> GetMeterData(
        [FromQuery] string period = "week",
        CancellationToken cancellationToken = default
    )
    {
        var meter = await dbContext.Meters
            .AsNoTracking()
            .Where(item => item.CustomerId == DemoCustomerId)
            .OrderBy(item => item.MeterNumber)
            .Select(item => item.MeterNumber)
            .FirstOrDefaultAsync(cancellationToken);
        if (meter is null)
        {
            return NotFound();
        }

        if (period is not ("day" or "week" or "month"))
        {
            return BadRequest("Period must be day, week, or month.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var count = period switch { "day" => 24, "week" => 7, _ => 30 };
        var current = BuildUsageSeries(today, count, period, 0);
        var previous = BuildUsageSeries(today, count, period, 1);
        return Ok(new MeterDataResponse(meter, current, previous));
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<IReadOnlyList<EndUserNotificationResponse>>> GetNotifications(
        [FromQuery] bool unreadOnly = false,
        CancellationToken cancellationToken = default
    )
    {
        var customerExists = await dbContext.Customers.AnyAsync(
            customer => customer.Id == DemoCustomerId,
            cancellationToken
        );
        if (!customerExists)
        {
            return NotFound();
        }

        var notifications = BuildNotifications();
        if (unreadOnly)
        {
            notifications = notifications.Where(item => !item.IsRead).ToArray();
        }

        return Ok(notifications);
    }

    private static IReadOnlyList<EndUserBillResponse> BuildBills(DateOnly today)
    {
        var currentMonth = new DateOnly(today.Year, today.Month, 1);
        return Enumerable.Range(0, 12)
            .Select(offset => currentMonth.AddMonths(-offset))
            .Select(month =>
            {
                var monthIndex = month.Year * 12 + month.Month;
                var status = (monthIndex % 6) switch
                {
                    0 => "Overdue",
                    1 => "Pending",
                    _ => "Paid",
                };
                var amount = BuildBillDays(
                    month,
                    DateTime.DaysInMonth(month.Year, month.Month)
                ).Sum(day => day.Cost);
                return new EndUserBillResponse(
                    month.ToString("yyyy-MM"),
                    month,
                    amount,
                    month.AddMonths(1).AddDays(9),
                    status,
                    status == "Paid" ? month.AddMonths(1).AddDays(-2) : null
                );
            })
            .ToArray();
    }

    private static IReadOnlyList<BillDayResponse> BuildBillDays(DateOnly month, int count)
    {
        decimal reading = 1200m;
        var days = new BillDayResponse[count];
        for (var index = 0; index < count; index++)
        {
            var consumption = Math.Round(8m + ((index * 7) % 19) + (index % 3) * 0.35m, 2);
            reading += consumption;
            days[index] = new BillDayResponse(
                month.AddDays(index),
                reading,
                consumption,
                Math.Round(consumption * 7.5m, 2)
            );
        }

        return days;
    }

    private static IReadOnlyList<EndUserNotificationResponse> BuildNotifications()
    {
        var samples = new (string Type, string Title, string Message)[]
        {
            ("Bill", "Your latest bill is ready", "Your November bill is available to view."),
            ("Payment", "Payment due soon", "Your electricity bill is due in five days."),
            ("Payment", "Payment received", "We received your payment of ₹1,860."),
            ("Usage", "Higher than usual consumption", "Your usage was higher than your recent average yesterday."),
            ("Meter", "Meter maintenance scheduled", "A technician visit is scheduled for your area."),
            ("Bill", "Your October bill is ready", "Your October bill is available to view."),
            ("Payment", "Payment due soon", "Your October bill is due in five days."),
            ("Usage", "Weekly usage summary", "Your weekly consumption summary is ready."),
            ("Meter", "Meter reading received", "A new reading was received from meter MTR-1001."),
            ("Payment", "Payment received", "Your recent payment has been recorded."),
            ("Usage", "Higher than usual consumption", "Your usage was higher than usual this week."),
            ("Bill", "Your September bill is ready", "Your September bill is available to view."),
            ("Meter", "Meter maintenance completed", "Scheduled maintenance for your meter is complete."),
            ("Payment", "Payment due reminder", "Your bill payment date is approaching."),
            ("Usage", "Monthly usage summary", "Your monthly consumption summary is ready."),
        };

        return samples.Select((sample, index) => new EndUserNotificationResponse(
            $"NTF-{index + 1:0000}",
            sample.Type,
            sample.Title,
            sample.Message,
            DateTimeOffset.UtcNow.AddHours(-index * 5),
            index % 3 != 0
        )).ToArray();
    }

    private static IReadOnlyList<DashboardConsumptionPointResponse> BuildDashboardSeries(string period)
    {
        var labels = period switch
        {
            "day" => new[] { "12am", "4am", "8am", "12pm", "4pm", "8pm" },
            "week" => new[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" },
            "month" => new[] { "W1", "W2", "W3", "W4" },
            _ => new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" },
        };

        return labels.Select((label, index) => new DashboardConsumptionPointResponse(
            label,
            10 + ((index * 37) % 23)
        )).ToArray();
    }

    private static IReadOnlyList<MeterUsagePointResponse> BuildUsageSeries(
        DateOnly today,
        int count,
        string period,
        int previousOffset
    )
    {
        var points = new MeterUsagePointResponse[count];
        decimal reading = 1000m + previousOffset * 220m;
        for (var index = 0; index < count; index++)
        {
            var date = period == "day"
                ? today
                : today.AddDays(-(count - index - 1) - previousOffset * count);
            var consumption = Math.Round(
                (period == "day" ? 0.45m : 5.2m) + ((index * 11 + previousOffset * 3) % 17) * 0.42m,
                2
            );
            reading += consumption;
            var label = period == "day"
                ? $"{index:00}:00"
                : date.ToString("dd MMM");
            points[index] = new MeterUsagePointResponse(
                label,
                date,
                reading,
                consumption,
                index % 9 == 0 ? "Peak usage" : "Normal"
            );
        }

        return points;
    }
}

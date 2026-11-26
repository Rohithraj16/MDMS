using MDMS.Api.Contracts;
using MDMS.Api.Data;
using MDMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/meters")]
public sealed class MetersController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<MeterResponse>>> GetMeters(
        [FromQuery] int? zoneId,
        [FromQuery] string? status,
        CancellationToken cancellationToken
    )
    {
        var meters = dbContext.Meters.AsNoTracking();

        if (zoneId.HasValue)
        {
            meters = meters.Where(meter => meter.Customer.ZoneId == zoneId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            meters = meters.Where(meter => meter.Status == status);
        }

        var response = await meters
            .OrderBy(meter => meter.MeterNumber)
            .Select(meter => new MeterResponse(
                meter.MeterNumber,
                meter.Customer.Zone.Name,
                meter.Status,
                meter.ReadingKwh,
                meter.LastUpdated
            ))
            .ToListAsync(cancellationToken);

        return Ok(response);
    }

    [HttpGet("{meterNumber}")]
    public async Task<ActionResult<MeterDetailsResponse>> GetMeter(
        string meterNumber,
        CancellationToken cancellationToken
    )
    {
        var response = await dbContext.Meters
            .AsNoTracking()
            .Where(meter => meter.MeterNumber == meterNumber)
            .Select(meter => new MeterDetailsResponse(
                meter.MeterNumber,
                meter.Customer.Zone.Name,
                meter.Status,
                meter.ReadingKwh,
                meter.LastUpdated,
                meter.Customer.Id,
                meter.Customer.AccountNumber,
                meter.Customer.FullName
            ))
            .SingleOrDefaultAsync(cancellationToken);

        return response is null ? NotFound() : Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<MeterResponse>> CreateMeter(
        CreateMeterRequest request,
        CancellationToken cancellationToken
    )
    {
        var meterNumber = request.MeterNumber.Trim();
        if (meterNumber.Length is < 4 or > 24)
        {
            return BadRequest("Meter number must contain between 4 and 24 non-whitespace characters.");
        }

        var meterExists = await dbContext.Meters
            .AnyAsync(meter => meter.MeterNumber == meterNumber, cancellationToken);

        if (meterExists)
        {
            return Conflict("A meter with this meter number already exists.");
        }

        var customer = await dbContext.Customers
            .AsNoTracking()
            .Where(item => item.Id == request.CustomerId)
            .Select(item => new
            {
                item.Id,
                item.ZoneId,
                ZoneName = item.Zone.Name,
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (customer is null)
        {
            return BadRequest("The selected customer does not exist.");
        }

        var lastUpdated = DateOnly.FromDateTime(DateTime.UtcNow);
        var meter = new Meter
        {
            MeterNumber = meterNumber,
            Status = "Active",
            ReadingKwh = 0m,
            LastUpdated = lastUpdated,
            CustomerId = customer.Id,
        };

        dbContext.Meters.Add(meter);
        dbContext.MeterReadings.Add(
            new MeterReading
            {
                Meter = meter,
                ReadingDate = lastUpdated,
                ReadingKwh = 0m,
            }
        );

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new MeterResponse(
            meter.MeterNumber,
            customer.ZoneName,
            meter.Status,
            meter.ReadingKwh,
            meter.LastUpdated
        );

        return CreatedAtAction(nameof(GetMeters), new { zoneId = customer.ZoneId }, response);
    }
}

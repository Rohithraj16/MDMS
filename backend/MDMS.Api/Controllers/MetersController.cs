using MDMS.Api.Contracts;
using MDMS.Api.Data;
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
}

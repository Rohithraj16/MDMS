using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/zones")]
public sealed class ZonesController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ZoneResponse>>> GetZones(
        CancellationToken cancellationToken
    )
    {
        var zones = await dbContext.Zones
            .AsNoTracking()
            .OrderBy(zone => zone.Id)
            .Select(zone => new ZoneResponse(
                zone.Id,
                zone.Code,
                zone.Name,
                zone.Customers.Count
            ))
            .ToListAsync(cancellationToken);

        return Ok(zones);
    }
}

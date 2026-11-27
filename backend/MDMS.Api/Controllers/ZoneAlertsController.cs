using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/zones/{zoneId:int}/alerts")]
public sealed class ZoneAlertsController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ZoneAlertResponse>>> GetAlerts(
        int zoneId,
        [FromQuery] string? status,
        CancellationToken cancellationToken
    )
    {
        var normalizedStatus = NormalizeStatus(status);
        if (status is not null && normalizedStatus is null)
        {
            return BadRequest("Status must be 'Pending' or 'Resolved'.");
        }

        var zoneExists = await dbContext.Zones
            .AsNoTracking()
            .AnyAsync(zone => zone.Id == zoneId, cancellationToken);
        if (!zoneExists)
        {
            return NotFound();
        }

        var alerts = dbContext.Alerts
            .AsNoTracking()
            .Where(alert => alert.Meter.Customer.ZoneId == zoneId);

        if (normalizedStatus is not null)
        {
            alerts = alerts.Where(alert => alert.Status == normalizedStatus);
        }

        var response = await alerts
            .OrderByDescending(alert => alert.CreatedDate)
            .ThenBy(alert => alert.AlertNumber)
            .Select(alert => new ZoneAlertResponse(
                alert.AlertNumber,
                alert.Title,
                alert.Severity,
                alert.Status,
                alert.CreatedDate,
                alert.Meter.MeterNumber,
                alert.Meter.Customer.FullName
            ))
            .ToListAsync(cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{alertNumber}/status")]
    public async Task<ActionResult<ZoneAlertResponse>> UpdateAlertStatus(
        int zoneId,
        string alertNumber,
        UpdateZoneAlertStatusRequest request,
        CancellationToken cancellationToken
    )
    {
        var normalizedStatus = NormalizeStatus(request.Status);
        if (normalizedStatus is null)
        {
            return BadRequest("Status must be 'Pending' or 'Resolved'.");
        }

        var alert = await dbContext.Alerts
            .Where(item =>
                item.AlertNumber == alertNumber
                && item.Meter.Customer.ZoneId == zoneId
            )
            .SingleOrDefaultAsync(cancellationToken);

        if (alert is null)
        {
            return NotFound();
        }

        alert.Status = normalizedStatus;
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = await dbContext.Alerts
            .AsNoTracking()
            .Where(item => item.Id == alert.Id)
            .Select(item => new ZoneAlertResponse(
                item.AlertNumber,
                item.Title,
                item.Severity,
                item.Status,
                item.CreatedDate,
                item.Meter.MeterNumber,
                item.Meter.Customer.FullName
            ))
            .SingleAsync(cancellationToken);

        return Ok(response);
    }

    private static string? NormalizeStatus(string? status)
    {
        if (string.Equals(status, "Pending", StringComparison.OrdinalIgnoreCase))
        {
            return "Pending";
        }

        if (string.Equals(status, "Resolved", StringComparison.OrdinalIgnoreCase))
        {
            return "Resolved";
        }

        return null;
    }
}

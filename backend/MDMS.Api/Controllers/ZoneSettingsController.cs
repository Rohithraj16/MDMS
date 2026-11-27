using MDMS.Api.Contracts;
using MDMS.Api.Data;
using MDMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/zones/{zoneId:int}/settings")]
public sealed class ZoneSettingsController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ZoneSettingsResponse>> GetSettings(
        int zoneId,
        CancellationToken cancellationToken
    )
    {
        var settings = await dbContext.ZoneSettings
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.ZoneId == zoneId, cancellationToken);

        return settings is null ? NotFound() : Ok(ToResponse(settings));
    }

    [HttpPut]
    public async Task<ActionResult<ZoneSettingsResponse>> UpdateSettings(
        int zoneId,
        UpdateZoneSettingsRequest request,
        CancellationToken cancellationToken
    )
    {
        if (
            request.HighConsumptionThresholdKwh <= 0
            || request.LowVoltageThresholdVolts <= 0
            || request.HighVoltageThresholdVolts <= request.LowVoltageThresholdVolts
        )
        {
            return BadRequest(
                "Thresholds must be positive, and the high voltage threshold must exceed the low voltage threshold."
            );
        }

        var settings = await dbContext.ZoneSettings
            .SingleOrDefaultAsync(item => item.ZoneId == zoneId, cancellationToken);

        if (settings is null)
        {
            var zoneExists = await dbContext.Zones
                .AnyAsync(zone => zone.Id == zoneId, cancellationToken);
            if (!zoneExists)
            {
                return NotFound();
            }

            settings = new ZoneSettings { ZoneId = zoneId };
            dbContext.ZoneSettings.Add(settings);
        }

        settings.HighConsumptionThresholdKwh = request.HighConsumptionThresholdKwh;
        settings.LowVoltageThresholdVolts = request.LowVoltageThresholdVolts;
        settings.HighVoltageThresholdVolts = request.HighVoltageThresholdVolts;
        settings.EmailNotificationsEnabled = request.EmailNotificationsEnabled;
        settings.SmsNotificationsEnabled = request.SmsNotificationsEnabled;
        settings.InAppNotificationsEnabled = request.InAppNotificationsEnabled;

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(settings));
    }

    private static ZoneSettingsResponse ToResponse(ZoneSettings settings) =>
        new(
            settings.ZoneId,
            settings.HighConsumptionThresholdKwh,
            settings.LowVoltageThresholdVolts,
            settings.HighVoltageThresholdVolts,
            settings.EmailNotificationsEnabled,
            settings.SmsNotificationsEnabled,
            settings.InAppNotificationsEnabled
        );
}

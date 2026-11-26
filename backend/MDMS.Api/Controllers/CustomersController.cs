using MDMS.Api.Contracts;
using MDMS.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Controllers;

[ApiController]
[Route("api/customers")]
public sealed class CustomersController(MDMSDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CustomerResponse>>> GetCustomers(
        [FromQuery] int? zoneId,
        CancellationToken cancellationToken
    )
    {
        var customers = dbContext.Customers.AsNoTracking();

        if (zoneId.HasValue)
        {
            customers = customers.Where(customer => customer.ZoneId == zoneId.Value);
        }

        var response = await customers
            .OrderBy(customer => customer.Id)
            .Select(customer => new CustomerResponse(
                customer.Id,
                customer.AccountNumber,
                customer.FullName,
                customer.ZoneId,
                customer.Zone.Name,
                customer.Meters.Count
            ))
            .ToListAsync(cancellationToken);

        return Ok(response);
    }
}

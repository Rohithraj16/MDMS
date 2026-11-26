# MDMS API

The API uses ASP.NET Core 10, Entity Framework Core, and SQL Server.

## Local setup

1. Start a local SQL Server instance reachable at `127.0.0.1,1433`, or update the connection string for your instance.
2. From `backend/MDMS.Api`, save the connection string in .NET User Secrets:

   ```powershell
   dotnet user-secrets set "ConnectionStrings:MDMS" "Server=127.0.0.1,1433;Database=MDMS;User Id=YOUR_SQL_LOGIN;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;"
   ```

   Replace the placeholders locally. Never commit passwords or paste them into source files.
3. Create or update the database and seed data:

   ```powershell
   dotnet ef database update
   ```
4. Run the API:

   ```powershell
   dotnet run --launch-profile http
   ```
5. Open Swagger UI at `http://localhost:5247/swagger`.

The migrations seed four zones, twelve customers per zone, one meter per customer, and sample pending/resolved alerts. In Development, the API seeds 30 days of meter-reading history on startup if the reading-history table is empty.

## Endpoints

- `GET /api/zones`
- `GET /api/customers` (optional `zoneId` query parameter)
- `GET /api/meters` (optional `zoneId` and `status` query parameters)
- `GET /api/zones/{zoneId}/dashboard?period=weekly|monthly`
- `POST /api/meters` to add an active meter for an existing customer:

  ```json
  {
    "meterNumber": "MTR-2001",
    "customerId": 1
  }
  ```

The dashboard response includes active meter count, average daily usage per meter, pending alert count, and period consumption. The Zone Dashboard can also export the selected data as a CSV report.

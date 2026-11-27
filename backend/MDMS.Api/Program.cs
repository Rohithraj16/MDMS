using MDMS.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("MDMS");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Set the ConnectionStrings:MDMS configuration using .NET user-secrets or an environment variable."
    );
}

builder.Services.AddDbContext<MDMSDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ReactFrontend",
        policy =>
            policy
                .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactFrontend");
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    await MeterReadingSeeder.SeedAsync(app.Services);
}

app.Run();

public partial class Program { }

using MDMS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Data;

public sealed class MDMSDbContext(DbContextOptions<MDMSDbContext> options)
    : DbContext(options)
{
    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Meter> Meters => Set<Meter>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<MeterReading> MeterReadings => Set<MeterReading>();
    public DbSet<ZoneSettings> ZoneSettings => Set<ZoneSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Zone>(entity =>
        {
            entity.HasKey(zone => zone.Id);
            entity.Property(zone => zone.Code).HasMaxLength(8).IsRequired();
            entity.Property(zone => zone.Name).HasMaxLength(80).IsRequired();
            entity.HasIndex(zone => zone.Code).IsUnique();
            entity.HasData(SeedData.Zones);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(customer => customer.Id);
            entity.Property(customer => customer.AccountNumber).HasMaxLength(20).IsRequired();
            entity.Property(customer => customer.FullName).HasMaxLength(120).IsRequired();
            entity.HasIndex(customer => customer.AccountNumber).IsUnique();
            entity.HasOne(customer => customer.Zone)
                .WithMany(zone => zone.Customers)
                .HasForeignKey(customer => customer.ZoneId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasData(SeedData.Customers);
        });

        modelBuilder.Entity<Meter>(entity =>
        {
            entity.HasKey(meter => meter.Id);
            entity.Property(meter => meter.MeterNumber).HasMaxLength(24).IsRequired();
            entity.Property(meter => meter.Status).HasMaxLength(24).IsRequired();
            entity.Property(meter => meter.ReadingKwh).HasPrecision(12, 2);
            entity.HasIndex(meter => meter.MeterNumber).IsUnique();
            entity.HasOne(meter => meter.Customer)
                .WithMany(customer => customer.Meters)
                .HasForeignKey(meter => meter.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasData(SeedData.Meters);
        });

        modelBuilder.Entity<Alert>(entity =>
        {
            entity.HasKey(alert => alert.Id);
            entity.Property(alert => alert.AlertNumber).HasMaxLength(24).IsRequired();
            entity.Property(alert => alert.Title).HasMaxLength(160).IsRequired();
            entity.Property(alert => alert.Severity).HasMaxLength(24).IsRequired();
            entity.Property(alert => alert.Status).HasMaxLength(24).IsRequired();
            entity.HasIndex(alert => alert.AlertNumber).IsUnique();
            entity.HasIndex(alert => new { alert.Status, alert.MeterId });
            entity.HasOne(alert => alert.Meter)
                .WithMany(meter => meter.Alerts)
                .HasForeignKey(alert => alert.MeterId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasData(SeedData.Alerts);
        });

        modelBuilder.Entity<MeterReading>(entity =>
        {
            entity.HasKey(reading => reading.Id);
            entity.Property(reading => reading.ReadingKwh).HasPrecision(12, 2);
            entity.HasIndex(reading => new { reading.MeterId, reading.ReadingDate }).IsUnique();
            entity.HasOne(reading => reading.Meter)
                .WithMany(meter => meter.Readings)
                .HasForeignKey(reading => reading.MeterId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ZoneSettings>(entity =>
        {
            entity.HasKey(settings => settings.ZoneId);
            entity.Property(settings => settings.HighConsumptionThresholdKwh).HasPrecision(8, 2);
            entity.Property(settings => settings.LowVoltageThresholdVolts).HasPrecision(8, 2);
            entity.Property(settings => settings.HighVoltageThresholdVolts).HasPrecision(8, 2);
            entity.HasOne<Zone>()
                .WithOne()
                .HasForeignKey<ZoneSettings>(settings => settings.ZoneId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasData(SeedData.ZoneSettings);
        });

        base.OnModelCreating(modelBuilder);
    }
}

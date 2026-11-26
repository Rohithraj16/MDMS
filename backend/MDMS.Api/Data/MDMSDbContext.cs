using MDMS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MDMS.Api.Data;

public sealed class MDMSDbContext(DbContextOptions<MDMSDbContext> options)
    : DbContext(options)
{
    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Meter> Meters => Set<Meter>();

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

        base.OnModelCreating(modelBuilder);
    }
}

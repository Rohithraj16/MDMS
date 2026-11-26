using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MDMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Zones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    ZoneId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customers_Zones_ZoneId",
                        column: x => x.ZoneId,
                        principalTable: "Zones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Meters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeterNumber = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    ReadingKwh = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    LastUpdated = table.Column<DateOnly>(type: "date", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meters_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Zones",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[,]
                {
                    { 1, "NTH", "North" },
                    { 2, "STH", "South" },
                    { 3, "EST", "East" },
                    { 4, "WST", "West" }
                });

            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "Id", "AccountNumber", "FullName", "ZoneId" },
                values: new object[,]
                {
                    { 1, "ACC-0001", "Customer 0001", 1 },
                    { 2, "ACC-0002", "Customer 0002", 1 },
                    { 3, "ACC-0003", "Customer 0003", 1 },
                    { 4, "ACC-0004", "Customer 0004", 1 },
                    { 5, "ACC-0005", "Customer 0005", 1 },
                    { 6, "ACC-0006", "Customer 0006", 1 },
                    { 7, "ACC-0007", "Customer 0007", 1 },
                    { 8, "ACC-0008", "Customer 0008", 1 },
                    { 9, "ACC-0009", "Customer 0009", 1 },
                    { 10, "ACC-0010", "Customer 0010", 1 },
                    { 11, "ACC-0011", "Customer 0011", 1 },
                    { 12, "ACC-0012", "Customer 0012", 1 },
                    { 13, "ACC-0013", "Customer 0013", 2 },
                    { 14, "ACC-0014", "Customer 0014", 2 },
                    { 15, "ACC-0015", "Customer 0015", 2 },
                    { 16, "ACC-0016", "Customer 0016", 2 },
                    { 17, "ACC-0017", "Customer 0017", 2 },
                    { 18, "ACC-0018", "Customer 0018", 2 },
                    { 19, "ACC-0019", "Customer 0019", 2 },
                    { 20, "ACC-0020", "Customer 0020", 2 },
                    { 21, "ACC-0021", "Customer 0021", 2 },
                    { 22, "ACC-0022", "Customer 0022", 2 },
                    { 23, "ACC-0023", "Customer 0023", 2 },
                    { 24, "ACC-0024", "Customer 0024", 2 },
                    { 25, "ACC-0025", "Customer 0025", 3 },
                    { 26, "ACC-0026", "Customer 0026", 3 },
                    { 27, "ACC-0027", "Customer 0027", 3 },
                    { 28, "ACC-0028", "Customer 0028", 3 },
                    { 29, "ACC-0029", "Customer 0029", 3 },
                    { 30, "ACC-0030", "Customer 0030", 3 },
                    { 31, "ACC-0031", "Customer 0031", 3 },
                    { 32, "ACC-0032", "Customer 0032", 3 },
                    { 33, "ACC-0033", "Customer 0033", 3 },
                    { 34, "ACC-0034", "Customer 0034", 3 },
                    { 35, "ACC-0035", "Customer 0035", 3 },
                    { 36, "ACC-0036", "Customer 0036", 3 },
                    { 37, "ACC-0037", "Customer 0037", 4 },
                    { 38, "ACC-0038", "Customer 0038", 4 },
                    { 39, "ACC-0039", "Customer 0039", 4 },
                    { 40, "ACC-0040", "Customer 0040", 4 },
                    { 41, "ACC-0041", "Customer 0041", 4 },
                    { 42, "ACC-0042", "Customer 0042", 4 },
                    { 43, "ACC-0043", "Customer 0043", 4 },
                    { 44, "ACC-0044", "Customer 0044", 4 },
                    { 45, "ACC-0045", "Customer 0045", 4 },
                    { 46, "ACC-0046", "Customer 0046", 4 },
                    { 47, "ACC-0047", "Customer 0047", 4 },
                    { 48, "ACC-0048", "Customer 0048", 4 }
                });

            migrationBuilder.InsertData(
                table: "Meters",
                columns: new[] { "Id", "CustomerId", "LastUpdated", "MeterNumber", "ReadingKwh", "Status" },
                values: new object[,]
                {
                    { 1, 1, new DateOnly(2026, 11, 24), "MTR-1001", 837.5m, "Active" },
                    { 2, 2, new DateOnly(2026, 11, 23), "MTR-1002", 875.0m, "Maintenance" },
                    { 3, 3, new DateOnly(2026, 11, 22), "MTR-1003", 912.5m, "Inactive" },
                    { 4, 4, new DateOnly(2026, 11, 21), "MTR-1004", 950.0m, "Active" },
                    { 5, 5, new DateOnly(2026, 11, 20), "MTR-1005", 987.5m, "Maintenance" },
                    { 6, 6, new DateOnly(2026, 11, 19), "MTR-1006", 1025.0m, "Inactive" },
                    { 7, 7, new DateOnly(2026, 11, 18), "MTR-1007", 1062.5m, "Active" },
                    { 8, 8, new DateOnly(2026, 11, 17), "MTR-1008", 1100.0m, "Maintenance" },
                    { 9, 9, new DateOnly(2026, 11, 16), "MTR-1009", 1137.5m, "Inactive" },
                    { 10, 10, new DateOnly(2026, 11, 15), "MTR-1010", 1175.0m, "Active" },
                    { 11, 11, new DateOnly(2026, 11, 14), "MTR-1011", 1212.5m, "Maintenance" },
                    { 12, 12, new DateOnly(2026, 11, 13), "MTR-1012", 1250.0m, "Inactive" },
                    { 13, 13, new DateOnly(2026, 11, 12), "MTR-1013", 1287.5m, "Active" },
                    { 14, 14, new DateOnly(2026, 11, 25), "MTR-1014", 1325.0m, "Maintenance" },
                    { 15, 15, new DateOnly(2026, 11, 24), "MTR-1015", 1362.5m, "Inactive" },
                    { 16, 16, new DateOnly(2026, 11, 23), "MTR-1016", 1400.0m, "Active" },
                    { 17, 17, new DateOnly(2026, 11, 22), "MTR-1017", 1437.5m, "Maintenance" },
                    { 18, 18, new DateOnly(2026, 11, 21), "MTR-1018", 1475.0m, "Inactive" },
                    { 19, 19, new DateOnly(2026, 11, 20), "MTR-1019", 1512.5m, "Active" },
                    { 20, 20, new DateOnly(2026, 11, 19), "MTR-1020", 1550.0m, "Maintenance" },
                    { 21, 21, new DateOnly(2026, 11, 18), "MTR-1021", 1587.5m, "Inactive" },
                    { 22, 22, new DateOnly(2026, 11, 17), "MTR-1022", 1625.0m, "Active" },
                    { 23, 23, new DateOnly(2026, 11, 16), "MTR-1023", 1662.5m, "Maintenance" },
                    { 24, 24, new DateOnly(2026, 11, 15), "MTR-1024", 1700.0m, "Inactive" },
                    { 25, 25, new DateOnly(2026, 11, 14), "MTR-1025", 1737.5m, "Active" },
                    { 26, 26, new DateOnly(2026, 11, 13), "MTR-1026", 1775.0m, "Maintenance" },
                    { 27, 27, new DateOnly(2026, 11, 12), "MTR-1027", 1812.5m, "Inactive" },
                    { 28, 28, new DateOnly(2026, 11, 25), "MTR-1028", 1850.0m, "Active" },
                    { 29, 29, new DateOnly(2026, 11, 24), "MTR-1029", 1887.5m, "Maintenance" },
                    { 30, 30, new DateOnly(2026, 11, 23), "MTR-1030", 1925.0m, "Inactive" },
                    { 31, 31, new DateOnly(2026, 11, 22), "MTR-1031", 1962.5m, "Active" },
                    { 32, 32, new DateOnly(2026, 11, 21), "MTR-1032", 2000.0m, "Maintenance" },
                    { 33, 33, new DateOnly(2026, 11, 20), "MTR-1033", 2037.5m, "Inactive" },
                    { 34, 34, new DateOnly(2026, 11, 19), "MTR-1034", 2075.0m, "Active" },
                    { 35, 35, new DateOnly(2026, 11, 18), "MTR-1035", 2112.5m, "Maintenance" },
                    { 36, 36, new DateOnly(2026, 11, 17), "MTR-1036", 2150.0m, "Inactive" },
                    { 37, 37, new DateOnly(2026, 11, 16), "MTR-1037", 2187.5m, "Active" },
                    { 38, 38, new DateOnly(2026, 11, 15), "MTR-1038", 2225.0m, "Maintenance" },
                    { 39, 39, new DateOnly(2026, 11, 14), "MTR-1039", 2262.5m, "Inactive" },
                    { 40, 40, new DateOnly(2026, 11, 13), "MTR-1040", 2300.0m, "Active" },
                    { 41, 41, new DateOnly(2026, 11, 12), "MTR-1041", 2337.5m, "Maintenance" },
                    { 42, 42, new DateOnly(2026, 11, 25), "MTR-1042", 2375.0m, "Inactive" },
                    { 43, 43, new DateOnly(2026, 11, 24), "MTR-1043", 2412.5m, "Active" },
                    { 44, 44, new DateOnly(2026, 11, 23), "MTR-1044", 2450.0m, "Maintenance" },
                    { 45, 45, new DateOnly(2026, 11, 22), "MTR-1045", 2487.5m, "Inactive" },
                    { 46, 46, new DateOnly(2026, 11, 21), "MTR-1046", 2525.0m, "Active" },
                    { 47, 47, new DateOnly(2026, 11, 20), "MTR-1047", 2562.5m, "Maintenance" },
                    { 48, 48, new DateOnly(2026, 11, 19), "MTR-1048", 2600.0m, "Inactive" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Customers_AccountNumber",
                table: "Customers",
                column: "AccountNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_ZoneId",
                table: "Customers",
                column: "ZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_Meters_CustomerId",
                table: "Meters",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Meters_MeterNumber",
                table: "Meters",
                column: "MeterNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Zones_Code",
                table: "Zones",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Meters");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Zones");
        }
    }
}

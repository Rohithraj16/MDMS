using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MDMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class ZoneDashboardData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alerts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlertNumber = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedDate = table.Column<DateOnly>(type: "date", nullable: false),
                    MeterId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alerts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alerts_Meters_MeterId",
                        column: x => x.MeterId,
                        principalTable: "Meters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MeterReadings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeterId = table.Column<int>(type: "int", nullable: false),
                    ReadingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ReadingKwh = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeterReadings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeterReadings_Meters_MeterId",
                        column: x => x.MeterId,
                        principalTable: "Meters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Alerts",
                columns: new[] { "Id", "AlertNumber", "CreatedDate", "MeterId", "Severity", "Status", "Title" },
                values: new object[,]
                {
                    { 1, "ALT-1001", new DateOnly(2026, 11, 25), 1, "High", "Pending", "High consumption detected" },
                    { 2, "ALT-1002", new DateOnly(2026, 11, 24), 2, "Critical", "Pending", "Meter communication loss" },
                    { 3, "ALT-1003", new DateOnly(2026, 11, 23), 3, "Medium", "Resolved", "Voltage fluctuation detected" },
                    { 4, "ALT-1004", new DateOnly(2026, 11, 25), 13, "High", "Pending", "High consumption detected" },
                    { 5, "ALT-1005", new DateOnly(2026, 11, 24), 14, "Critical", "Pending", "Meter communication loss" },
                    { 6, "ALT-1006", new DateOnly(2026, 11, 23), 15, "Medium", "Resolved", "Voltage fluctuation detected" },
                    { 7, "ALT-1007", new DateOnly(2026, 11, 25), 25, "High", "Pending", "High consumption detected" },
                    { 8, "ALT-1008", new DateOnly(2026, 11, 24), 26, "Critical", "Pending", "Meter communication loss" },
                    { 9, "ALT-1009", new DateOnly(2026, 11, 23), 27, "Medium", "Resolved", "Voltage fluctuation detected" },
                    { 10, "ALT-1010", new DateOnly(2026, 11, 25), 37, "High", "Pending", "High consumption detected" },
                    { 11, "ALT-1011", new DateOnly(2026, 11, 24), 38, "Critical", "Pending", "Meter communication loss" },
                    { 12, "ALT-1012", new DateOnly(2026, 11, 23), 39, "Medium", "Resolved", "Voltage fluctuation detected" }
                });

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 5,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 6,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 7,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 8,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 9,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 10,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 11,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 12,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 13,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 15,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 16,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 17,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 18,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 19,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 20,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 21,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 22,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 23,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 24,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 25,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 26,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 27,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 29,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 30,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 31,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 32,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 33,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 34,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 35,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 36,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 37,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 38,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 39,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 40,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 41,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 43,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 44,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 45,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 46,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 47,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 48,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 25));

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AlertNumber",
                table: "Alerts",
                column: "AlertNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_MeterId",
                table: "Alerts",
                column: "MeterId");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_Status_MeterId",
                table: "Alerts",
                columns: new[] { "Status", "MeterId" });

            migrationBuilder.CreateIndex(
                name: "IX_MeterReadings_MeterId_ReadingDate",
                table: "MeterReadings",
                columns: new[] { "MeterId", "ReadingDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alerts");

            migrationBuilder.DropTable(
                name: "MeterReadings");

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 1,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 24));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 2,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 23));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 3,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 22));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 4,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 21));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 5,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 20));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 6,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 19));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 7,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 18));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 8,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 17));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 9,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 16));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 10,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 15));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 11,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 14));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 12,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 13));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 13,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 12));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 15,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 24));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 16,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 23));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 17,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 22));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 18,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 21));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 19,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 20));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 20,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 19));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 21,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 18));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 22,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 17));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 23,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 16));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 24,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 15));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 25,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 14));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 26,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 13));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 27,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 12));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 29,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 24));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 30,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 23));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 31,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 22));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 32,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 21));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 33,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 20));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 34,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 19));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 35,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 18));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 36,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 17));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 37,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 16));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 38,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 15));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 39,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 14));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 40,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 13));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 41,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 12));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 43,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 24));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 44,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 23));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 45,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 22));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 46,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 21));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 47,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 20));

            migrationBuilder.UpdateData(
                table: "Meters",
                keyColumn: "Id",
                keyValue: 48,
                column: "LastUpdated",
                value: new DateOnly(2026, 11, 19));
        }
    }
}

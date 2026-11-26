using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MDMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddZoneSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZoneSettings",
                columns: table => new
                {
                    ZoneId = table.Column<int>(type: "int", nullable: false),
                    HighConsumptionThresholdKwh = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    LowVoltageThresholdVolts = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    HighVoltageThresholdVolts = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    EmailNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    SmsNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    InAppNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZoneSettings", x => x.ZoneId);
                    table.ForeignKey(
                        name: "FK_ZoneSettings_Zones_ZoneId",
                        column: x => x.ZoneId,
                        principalTable: "Zones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ZoneSettings",
                columns: new[] { "ZoneId", "EmailNotificationsEnabled", "HighConsumptionThresholdKwh", "HighVoltageThresholdVolts", "InAppNotificationsEnabled", "LowVoltageThresholdVolts", "SmsNotificationsEnabled" },
                values: new object[,]
                {
                    { 1, true, 15m, 250m, true, 210m, true },
                    { 2, true, 15m, 250m, true, 210m, true },
                    { 3, true, 15m, 250m, true, 210m, true },
                    { 4, true, 15m, 250m, true, 210m, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZoneSettings");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FifoWellness.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WellnessLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShiftType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SleepHours = table.Column<double>(type: "float", nullable: false),
                    CalorieIntake = table.Column<int>(type: "int", nullable: false),
                    FatigueStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WellnessLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WellnessLogs");
        }
    }
}

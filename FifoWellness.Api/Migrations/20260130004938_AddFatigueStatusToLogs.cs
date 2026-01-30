using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FifoWellness.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFatigueStatusToLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FatigueStatus",
                table: "WellnessLogs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FatigueStatus",
                table: "WellnessLogs");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FifoWellness.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthAndShiftFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FatigueStatus",
                table: "WellnessLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "CaloriesBurned",
                table: "WellnessLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Steps",
                table: "WellnessLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaloriesBurned",
                table: "WellnessLogs");

            migrationBuilder.DropColumn(
                name: "Steps",
                table: "WellnessLogs");

            migrationBuilder.AlterColumn<string>(
                name: "FatigueStatus",
                table: "WellnessLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}

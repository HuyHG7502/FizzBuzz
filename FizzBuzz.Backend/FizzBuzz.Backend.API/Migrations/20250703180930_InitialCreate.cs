using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FizzBuzz.Backend.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Author = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    MinValue = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    MaxValue = table.Column<int>(type: "integer", nullable: false, defaultValue: 100),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.CheckConstraint("CK_Games_MinMaxValues", "\"MinValue\" <= \"MaxValue\"");
                });

            migrationBuilder.CreateTable(
                name: "GameRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Divisor = table.Column<int>(type: "integer", nullable: false),
                    Word = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameRules", x => x.Id);
                    table.CheckConstraint("CK_GameRules_Divisor", "\"Divisor\" >= 2");
                    table.ForeignKey(
                        name: "FK_GameRules_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GameId = table.Column<Guid>(type: "uuid", nullable: false),
                    Player = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    ScoreCorrect = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ScoreIncorrect = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameSessions", x => x.Id);
                    table.CheckConstraint("CK_GameSessions_Duration", "\"Duration\" > 0");
                    table.ForeignKey(
                        name: "FK_GameSessions_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameAnswers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    PlayerAnswer = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CorrectAnswer = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameAnswers", x => x.Id);
                    table.CheckConstraint("CK_GameAnswers_Number", "\"Number\" >= 1");
                    table.ForeignKey(
                        name: "FK_GameAnswers_GameSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "GameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameAnswers_SessionId_Number",
                table: "GameAnswers",
                columns: new[] { "SessionId", "Number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameRules_GameId_Divisor",
                table: "GameRules",
                columns: new[] { "GameId", "Divisor" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_Name",
                table: "Games",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_GameId",
                table: "GameSessions",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameAnswers");

            migrationBuilder.DropTable(
                name: "GameRules");

            migrationBuilder.DropTable(
                name: "GameSessions");

            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}

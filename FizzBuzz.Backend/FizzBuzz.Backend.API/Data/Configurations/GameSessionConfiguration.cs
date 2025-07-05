using FizzBuzz.Backend.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FizzBuzz.Backend.API.Data.Configurations
{
    public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
    {
        public void Configure(EntityTypeBuilder<GameSession> builder)
        {
            builder.ToTable("GameSessions", t =>
            {
                t.HasCheckConstraint("CK_GameSessions_Duration", "\"Duration\" > 0");
            });

            builder.HasKey(gs => gs.Id);

            builder.Property(gs => gs.Player)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            builder.Property(gs => gs.Duration)
                .IsRequired();

            builder.Property(gs => gs.ScoreCorrect)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(gs => gs.ScoreIncorrect)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(gs => gs.StartedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.Property(gs => gs.CompletedAt)
                .IsRequired(false);

            // Relationships
            builder.HasOne(gs => gs.Game)
                .WithMany()
                .HasForeignKey(gs => gs.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(gs => gs.Answers)
                .WithOne(ga => ga.Session)
                .HasForeignKey(ga => ga.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

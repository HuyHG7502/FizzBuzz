using FizzBuzz.Backend.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FizzBuzz.Backend.API.Data.Configurations
{
    public class GameAnswerConfiguration : IEntityTypeConfiguration<GameAnswer>
    {
        public void Configure(EntityTypeBuilder<GameAnswer> builder)
        {
            builder.ToTable("GameAnswers", t =>
            {
                t.HasCheckConstraint("CK_GameAnswers_Number", "\"Number\" >= 1");
            });

            builder.HasKey(ga => ga.Id);

            builder.Property(ga => ga.Number)
                .IsRequired();

            builder.Property(ga => ga.PlayerAnswer)
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("varchar(200)");

            builder.Property(ga => ga.CorrectAnswer)
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("varchar(200)");

            builder.Property(ga => ga.IsCorrect)
                .IsRequired();

            builder.Property(ga => ga.AnsweredAt)
                .IsRequired();

            // Relationships
            builder.HasOne(ga => ga.Session)
                .WithMany(gs => gs.Answers)
                .HasForeignKey(ga => ga.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indices
            builder.HasIndex(ga => new { ga.SessionId, ga.Number })
                .IsUnique()
                .HasDatabaseName("IX_GameAnswers_SessionId_Number");
        }
    }
}

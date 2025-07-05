using FizzBuzz.Backend.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FizzBuzz.Backend.API.Data.Configurations
{
    public class GameRuleConfiguration : IEntityTypeConfiguration<GameRule>
    {
        public void Configure(EntityTypeBuilder<GameRule> builder)
        {
            builder.ToTable("GameRules", t =>
            {
                t.HasCheckConstraint("CK_GameRules_Divisor", "\"Divisor\" >= 2");
            });

            builder.HasKey(gr => gr.Id);

            builder.Property(gr => gr.Divisor)
                .IsRequired();

            builder.Property(gr => gr.Word)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");

            // Relationships
            builder.HasOne(gr => gr.Game)
                .WithMany(g => g.Rules)
                .HasForeignKey(gr => gr.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indices
            builder.HasIndex(gr => new { gr.GameId, gr.Divisor })
                .IsUnique()
                .HasDatabaseName("IX_GameRules_GameId_Divisor");
        }
    }
}

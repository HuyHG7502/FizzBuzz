using FizzBuzz.Backend.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FizzBuzz.Backend.API.Data.Configurations
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> builder)
        {
            builder.ToTable("Games", t =>
            {
                t.HasCheckConstraint("CK_Games_MinMaxValues", "\"MinValue\" <= \"MaxValue\"");
            });
            
            builder.HasKey(g => g.Id);

            builder.Property(g => g.Name)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            builder.Property(g => g.Author)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            builder.Property(g => g.MinValue)
                .IsRequired()
                .HasDefaultValue(1);

            builder.Property(g => g.MaxValue)
                .IsRequired()
                .HasDefaultValue(100);

            builder.Property(g => g.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            // Relationships
            builder.HasMany(g => g.Rules)
                   .WithOne(r => r.Game)
                   .HasForeignKey(r => r.GameId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Indices
            builder.HasIndex(g => g.Name)
                .IsUnique()
                .HasDatabaseName("IX_Games_Name");

        }
    }
}

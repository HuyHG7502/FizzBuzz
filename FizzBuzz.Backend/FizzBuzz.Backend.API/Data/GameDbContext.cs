using FizzBuzz.Backend.API.Entities;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace FizzBuzz.Backend.API.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options)
            : base(options) { }

        public DbSet<Game> Games => Set<Game>();
        public DbSet<GameRule> GameRules => Set<GameRule>();
        public DbSet<GameSession> GameSessions => Set<GameSession>();
        public DbSet<GameAnswer> GameAnswers => Set<GameAnswer>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Automatically apply all IEntityTypeConfiguration configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(GameDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            var now = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = now;
                }
            }

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            var now = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = now;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}

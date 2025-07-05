using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Entities;
using System.Diagnostics;
using System.Text.Json;

namespace FizzBuzz.Backend.API.Helpers
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(GameDbContext dbContext, string jsonPath)
        {
            if (!File.Exists(jsonPath))
            {
                Debug.WriteLine($"Seed file not found at path: {jsonPath}");
                return;
            }

            var json = await File.ReadAllTextAsync(jsonPath);
            var data = JsonSerializer.Deserialize<List<Game>>(json);

            if (data == null || data.Count == 0)
            {
                Debug.WriteLine("No valid game data found in the seed file.");
                return;
            }

            if (dbContext.Games.Any())
            {
                Debug.WriteLine("Games already exist. Skipping seeding.");
                return;
            }

            foreach (var game in data)
            {
                game.Id = Guid.NewGuid();

                // Assign GameId to each rule
                foreach (var rule in game.Rules)
                {
                    rule.GameId = game.Id;
                }

                dbContext.Games.Add(game);
            }

            await dbContext.SaveChangesAsync();
            Debug.WriteLine($"Seeded {data.Count} games successfully.");
        }
    }
}

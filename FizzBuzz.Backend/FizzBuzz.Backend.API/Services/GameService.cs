using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Helpers.Mappers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Models.Game;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.API.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _dbContext;

        public GameService(GameDbContext dbContext)
            => _dbContext = dbContext;

        public async Task<IEnumerable<GameResponse>> GetAllGamesAsync()
        {
            return await _dbContext.Games
                .Include(g => g.Rules)
                .Select(g => g.ToGameResponse())
                .ToListAsync();
        }

        public async Task<GameResponse?> GetGameByIdAsync(Guid gameId)
        {
            var game = await _dbContext.Games
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            return game?.ToGameResponse();
        }

        public async Task<GameResponse> CreateGameAsync(CreateGameRequest request)
        {
            if (await ExistsGameAsync(request.Name))
                throw new ArgumentException($"Game with name '{request.Name}' already exists.");

            ValidateGameRequest(request);

            var game = request.ToEntity();

            _dbContext.Games.Add(game);
            await _dbContext.SaveChangesAsync();

            return game.ToGameResponse();
        }

        public async Task<GameResponse> UpdateGameAsync(Guid gameId, CreateGameRequest request)
        {
            var game = await _dbContext.Games
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
                throw new KeyNotFoundException($"Game with ID {gameId} not found.");

            if (await ExistsGameAsync(request.Name, gameId))
                throw new ArgumentException($"Game with name '{request.Name}' already exists.");

            ValidateGameRequest(request);

            // Update game rules
            _dbContext.GameRules.RemoveRange(game.Rules);
            await _dbContext.SaveChangesAsync();

            game.UpdateFromDto(request);
            
            _dbContext.GameRules.AddRange(game.Rules);
            await _dbContext.SaveChangesAsync();

            return game.ToGameResponse();
        }

        public async Task<bool> DeleteGameAsync(Guid gameId)
        {
            var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId);
            if (game == null)
                return false;

            _dbContext.Games.Remove(game);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private async Task<bool> ExistsGameAsync(string name, Guid? gameId = null)
        {
            return await _dbContext.Games
                .AnyAsync(g =>
                    (gameId == null || g.Id != gameId) &&
                    g.Name.ToLower() == name.ToLower());
        }

        private void ValidateGameRequest(CreateGameRequest request)
        {
            // 1. Check for valid range
            if (request.MinValue > request.MaxValue)
                throw new ValidationException("MinValue must be less than or equal to MaxValue.");

            // 2. Check for valid divisors
            if (request.Rules.Any(r => r.Divisor <= 1))
                throw new ValidationException("All divisors must be greater than 1.");

            if (request.Rules.Any(r => r.Divisor < request.MinValue || r.Divisor > request.MaxValue))
                throw new ValidationException("All divisors must be within the specified range.");

            // 3. Check for duplicate rules
            if (request.Rules.GroupBy(r => r.Divisor).Any(g => g.Count() > 1))
                throw new ValidationException("Duplicate rules found. Each divisor must be unique.");

        }
    }
}

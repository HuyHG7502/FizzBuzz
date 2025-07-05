using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Models.Game;
using FizzBuzz.Backend.API.Services;
using FizzBuzz.Backend.Tests.Fixtures;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.Tests.Services
{
    public class GameServiceTests : IDisposable
    {
        private readonly GameDbContext _context;
        private readonly GameService _service;

        public GameServiceTests()
        {
            var options = new DbContextOptionsBuilder<GameDbContext>()
                .UseInMemoryDatabase(databaseName: $"FizzBuzzTestDb_Game_{Guid.NewGuid()}")
                .Options;

            _context = new GameDbContext(options);
            _service = new GameService(_context);
        }

        public void Dispose() => _context.Dispose();

        [Fact]
        public async Task CreateGameAsync_ShouldAddGameWithRules()
        {
            // Arrange
            var request = MockData.FizzBuzzRequest();

            // Act
            var result = await _service.CreateGameAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.Name, result.Name);
            Assert.Equal(2, request.Rules.Count);
            Assert.Contains(result.Rules, r => r.Divisor == 3 && r.Word == "Fizz ");
            Assert.True(await _context.Games.AnyAsync(g => g.Id == result.Id));
        }

        [Fact]
        public async Task CreateGameAsync_ShouldThrow_WhenRulesHaveDuplicatDivisors()
        {
            // Arrange
            var request = MockData.FizzBuzzRequest();
            request.Rules = [
                new() { Divisor = 3, Word = "Fizz" },
                new() { Divisor = 3, Word = "Buzz" }
            ];

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _service.CreateGameAsync(request));
        }

        [Fact]
        public async Task CreateGameAsync_ShouldThrow_WhenMinGreaterThanMax()
        {
            // Arrange
            var request = MockData.FizzBuzzRequest();
            request.MinValue = 100;
            request.MaxValue = 1;

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _service.CreateGameAsync(request));
        }

        [Fact]
        public async Task GetAllGamesAsync_ShouldReturnAllGames()
        {
            // Arrange
            var requests = new List<CreateGameRequest>()
            {
                MockData.FizzBuzzRequest(),
                MockData.FooBooLooRequest()
            };

            foreach (var request in requests)
            {
                await _service.CreateGameAsync(request);
            }

            // Act
            var games = await _service.GetAllGamesAsync();

            // Assert
            Assert.Equal(2, games.Count());
            Assert.Contains(games, g => g.Name == "FizzBuzz");
        }

        [Fact]
        public async Task DeleteGameAsync_ShouldRemoveGame()
        {
            // Arrange
            var request = MockData.FizzBuzzRequest();

            var created = await _service.CreateGameAsync(request);

            // Act
            var deleted = await _service.DeleteGameAsync(created.Id);
            var fetched = await _service.GetGameByIdAsync(created.Id);

            // Assert
            Assert.True(deleted);
            Assert.Null(fetched);
            Assert.DoesNotContain(_context.Games, g => g.Id == created.Id);
        }

        [Fact]
        public async Task DeleteGameAsync_ShouldReturnFalse_WhenGameDoesNotExist()
        {
            // Act
            var result = await _service.DeleteGameAsync(Guid.NewGuid());

            // Assert
            Assert.False(result);
        }
    }
}

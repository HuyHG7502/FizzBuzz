using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Services;
using FizzBuzz.Backend.Tests.Fixtures;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz.Backend.Tests.Services
{
    public class SessionServiceTests : IDisposable
    {
        private readonly GameDbContext _context;
        private readonly GameSessionService _service;

        public SessionServiceTests()
        {
            var options = new DbContextOptionsBuilder<GameDbContext>()
                .UseInMemoryDatabase(databaseName: $"FizzBuzzTestDb_Session_{Guid.NewGuid()}")
                .Options;

            _context = new GameDbContext(options);
            _service = new GameSessionService(_context);
        }

        public void Dispose() => _context.Dispose();

        [Fact]
        public async Task StartSessionAsync_ShouldCreateNewSession()
        {
            // Arrange
            var game = MockData.FizzBuzz();
            var request = MockData.FizzBuzzSessionRequest(game);

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            // Act
            var session = await _service.StartSessionAsync(request);

            // Assert
            Assert.NotEqual(Guid.Empty, session.SessionId);
            Assert.Equal(request.Player, session.Player);
        }

        [Fact]
        public async Task StartSessionAsync_ShouldThrow_WhenGameDoesNotExist()
        {
            // Arrange
            var request = MockData.FizzBuzzSessionRequest();

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _service.StartSessionAsync(request));
        }

        [Fact]
        public async Task GetSessionStateAsync_ShouldReturnExhausted_IfNoNumbersLeft()
        {
            // Arrange
            var game = MockData.FizzBuzz();
            game.MinValue = game.MaxValue = 10;
            _context.Games.Add(game);

            var session = MockData.FizzBuzzSession(game);
            _context.GameSessions.Add(session);

            var answer = MockData.FizzBuzzAnswer(session);
            _context.GameAnswers.Add(answer);

            await _context.SaveChangesAsync();

            var total = game.MaxValue - game.MinValue + 1;

            // Act
            var state = await _service.GetSessionStateAsync(session.Id);

            // Assert
            Assert.True(state.IsExhausted);
            Assert.Null(state.Number);
            Assert.Equal(total, state.TotalNumbers);
        }
    }
}

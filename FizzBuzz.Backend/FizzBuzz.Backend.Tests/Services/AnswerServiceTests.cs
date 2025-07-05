using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Services;
using FizzBuzz.Backend.Tests.Fixtures;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz.Backend.Tests.Services;

public class AnswerServiceTests : IDisposable
{
    private readonly FizzBuzzEngine _engine;
    private readonly GameDbContext _context;
    private readonly GameAnswerService _service;

    public AnswerServiceTests()
    {
        var options = new DbContextOptionsBuilder<GameDbContext>()
            .UseInMemoryDatabase(databaseName: $"FizzBuzzTestDb_Answer_{Guid.NewGuid()}")
            .Options;

        _engine = new FizzBuzzEngine();
        _context = new GameDbContext(options);
        _service = new GameAnswerService(_context, _engine);
    }

    public void Dispose() => _context.Dispose();

    public static IEnumerable<object[]> ValidFizzBuzzAnswers =>
        new List<object[]>
    {
        new object[] { 1, "1", true },
        new object[] { 3, "Fizz", true },
        new object[] { 5, "Buzz", true },
        new object[] { 15, "Fizz Buzz", true },
        new object[] { 2, "Buzz", false },
    };

    [Fact]
    public async Task SubmitAnswerAsync_ShouldSucceed_WithCorrectAnswer()
    {
        // Arrange
        var session = await CreateSessionAsync();
        var request = MockData.FizzBuzzAnswerRequest(session);

        // Act
        var result = await _service.SubmitAnswerAsync(request);

        Assert.True(result.IsCorrect);
        Assert.Equal(request.Answer, result.CorrectAnswer);
        Assert.Equal(1, result.ScoreCorrect);
        Assert.False(result.IsGameCompleted);
    }

    [Fact]
    public async Task SubmitAnswerAsync_ShouldThrow_WhenDuplicateAnswer()
    {
        // Arrange
        var session = await CreateSessionAsync();
        var request = MockData.FizzBuzzAnswerRequest(session);

        request.Number = 1;
        request.Answer = "1";

        // Act
        await _service.SubmitAnswerAsync(request);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.SubmitAnswerAsync(request));
    }

    [Theory]
    [MemberData(nameof(ValidFizzBuzzAnswers))]
    public async Task SubmitAnswerAsync_HandleManyAnswers(int number, string answer, bool isCorrect)
    {
        // Arrange
        var session = await CreateSessionAsync();
        var correct = _engine.Compute(number, session.Game.Rules.ToList());

        var request = MockData.FizzBuzzAnswerRequest(session);
        request.Number = number;
        request.Answer = answer;

        // Act
        var result = await _service.SubmitAnswerAsync(request);

        // Assert
        Assert.Equal(isCorrect, result.IsCorrect);
        Assert.Equal(correct, result.CorrectAnswer);
        Assert.False(result.IsGameCompleted);
    }

    [Fact]
    public async Task SubmitAnswerAsync_ShouldEndGame_WhenAllNumbersAnswered()
    {
        // Arrange
        var game = MockData.FizzBuzz();
        game.MinValue = game.MaxValue = 10;
        _context.Games.Add(game);

        var session = MockData.FizzBuzzSession(game);
        _context.GameSessions.Add(session);

        await _context.SaveChangesAsync();

        var request = MockData.FizzBuzzAnswerRequest(session);
        request.Number = 10;
        request.Answer = "Buzz";

        // Act
        var result = await _service.SubmitAnswerAsync(request);

        // Assert
        Assert.True(result.IsCorrect);
    }

    [Fact]
    public async Task SubmitAnswerAsync_ShouldThrow_WhenSessionExpired()
    {
        // Arrange
        var game = MockData.FizzBuzz();
        _context.Games.Add(game);

        var session = MockData.FizzBuzzSession(game);
        session.Duration = 1;
        session.StartedAt = DateTime.UtcNow.AddSeconds(-100);
        _context.GameSessions.Add(session);

        await _context.SaveChangesAsync();

        var request = MockData.FizzBuzzAnswerRequest(session);

        // Act and Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.SubmitAnswerAsync(request));

        Assert.Equal("Session has expired.", ex.Message);
    }

    private async Task<GameSession> CreateSessionAsync()
    {
        var game = MockData.FizzBuzz();
        _context.Games.Add(game);

        var session = MockData.FizzBuzzSession(game);
        _context.GameSessions.Add(session);

        await _context.SaveChangesAsync();

        return session;
    }
}
using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Helpers.Mappers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Models.GameSession;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz.Backend.API.Services
{
    public class GameSessionService : IGameSessionService
    {
        private readonly GameDbContext _dbContext;

        public GameSessionService(GameDbContext dbContext)
            => _dbContext = dbContext;

        public async Task<SessionStateResponse> GetSessionStateAsync(Guid sessionId)
        {
            var session = await _dbContext.GameSessions
                .Include(s => s.Game)
                .Include(s => s.Answers)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new KeyNotFoundException($"Session with ID {sessionId} not found.");

            var now = DateTime.UtcNow;
            var timeElapsed = (int)(now - session.StartedAt).TotalSeconds;
            var timeRemaining = Math.Max(0, session.Duration - timeElapsed);
        
            var totalNumbers = session.Game.MaxValue - session.Game.MinValue + 1;
            var usedNumbers = session.Answers.Select(a => a.Number).ToHashSet();
            var remainingNumbers = Enumerable.Range(session.Game.MinValue, totalNumbers)
                .Where(n => !usedNumbers.Contains(n))
                .ToList();

            bool isTimeUp = timeRemaining <= 0;
            bool isExhausted = remainingNumbers.Count == 0;
            bool isCompleted = session.IsCompleted || isTimeUp || isExhausted;

            if (isCompleted && session.CompletedAt == null)
            {
                session.CompletedAt = now;
                await _dbContext.SaveChangesAsync();
            }

            return new SessionStateResponse
            {
                Number = isCompleted ? null : remainingNumbers[new Random().Next(remainingNumbers.Count)],
                IsExhausted = isExhausted,
                IsCompleted = isCompleted,
                ScoreCorrect = session.ScoreCorrect,
                ScoreIncorrect = session.ScoreIncorrect,
                TotalNumbers = totalNumbers,
                TotalAnswers = usedNumbers.Count,
                TimeRemaining = timeRemaining
            };
        }

        public async Task<SessionResponse?> GetSessionAsync(Guid sessionId)
        {
            var session = await _dbContext.GameSessions
                .Include(s => s.Game)
                    .ThenInclude(g => g.Rules)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            return session?.ToSessionResponse(session.Game);
        }

        public async Task<SessionResponse> StartSessionAsync(StartSessionRequest request)
        {
            var game = await _dbContext.Games
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == request.GameId);

            if (game == null)
                throw new KeyNotFoundException($"Game with ID {request.GameId} not found.");

            if (request.Duration <= 0)
                throw new ArgumentException("Duration must be greater than 0 seconds.");

            var session = request.ToEntity();

            _dbContext.GameSessions.Add(session);
            await _dbContext.SaveChangesAsync();

            return session.ToSessionResponse(game);
        }

        public async Task<SessionResultResponse> EndSessionAsync(Guid sessionId)
        {
            var session = await _dbContext.GameSessions
                .Include(s => s.Game)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new KeyNotFoundException($"Session with ID {sessionId} not found.");

            if (!session.IsCompleted)
            {
                session.CompletedAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
            }

            var totalNumbers = session.Game.MaxValue - session.Game.MinValue + 1;
            var totalAnswers = session.ScoreCorrect + session.ScoreIncorrect;
            var accuracy = totalAnswers > 0 ? Math.Round((double) session.ScoreCorrect / totalAnswers, 2) : 0;

            return new SessionResultResponse
            {
                Game = session.Game.Name,
                Player = session.Player,
                Duration = session.Duration,
                ScoreCorrect = session.ScoreCorrect,
                ScoreIncorrect = session.ScoreIncorrect,
                TotalNumbers = totalNumbers,
                TotalAnswers = totalAnswers,
                Accuracy = accuracy,
                StartedAt = session.StartedAt,
                CompletedAt = session.CompletedAt ?? DateTime.UtcNow,
            };
        }
    }
}

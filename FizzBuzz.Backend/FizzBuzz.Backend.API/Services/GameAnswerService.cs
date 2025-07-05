using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Helpers.Mappers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Models.GameAnswer;
using FizzBuzz.Backend.API.Models.GameSession;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz.Backend.API.Services
{
    public class GameAnswerService : IGameAnswerService
    {
        private readonly GameDbContext _dbContext;
        private readonly IFizzBuzzEngine _fbEngine;

        public GameAnswerService(GameDbContext dbContext, IFizzBuzzEngine fbEngine)
            => (_dbContext, _fbEngine) = (dbContext, fbEngine);

        public async Task<AnswerResponse> SubmitAnswerAsync(SubmitAnswerRequest request)
        {
            var session = await _dbContext.GameSessions
                .Include(s => s.Game)
                    .ThenInclude(g => g.Rules)
                .Include(s => s.Answers)
                .FirstOrDefaultAsync(s => s.Id == request.SessionId);

            if (session == null)
                throw new KeyNotFoundException($"Session {request.SessionId} not found.");

            if (session.IsCompleted)
                throw new InvalidOperationException("This session is already completed.");

            var timeElapsed = (int)(DateTime.UtcNow - session.StartedAt).TotalSeconds;
            if (timeElapsed >= session.Duration)
            {
                session.CompletedAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
                throw new InvalidOperationException("Session has expired.");
            }

            if (session.Answers.Any(a => a.Number == request.Number))
                throw new InvalidOperationException($"Number {request.Number} has already been answered.");

            var correctAnswer = _fbEngine.Compute(request.Number, session.Game.Rules.ToList());
            var isCorrect = _fbEngine.Validate(request.Number, request.Answer, session.Game.Rules.ToList());

            var answer = request.ToEntity((correctAnswer, isCorrect));

            _dbContext.GameAnswers.Add(answer);

            if (isCorrect)
                session.ScoreCorrect++;
            else
                session.ScoreIncorrect++;

            await _dbContext.SaveChangesAsync();

            // Complete session if all numbers exhausted
            var totalAvailable = session.Game.MaxValue - session.Game.MinValue + 1;
            var totalUsed = session.Answers.Count;
            if (totalUsed >= totalAvailable)
            {
                session.CompletedAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
            }

            return new AnswerResponse()
            {
                IsCorrect = isCorrect,
                CorrectAnswer = correctAnswer,
                PlayerAnswer = request.Answer,
                ScoreCorrect = session.ScoreCorrect,
                ScoreIncorrect = session.ScoreIncorrect,
                IsGameCompleted = session.CompletedAt.HasValue
            };
        }
    }
}

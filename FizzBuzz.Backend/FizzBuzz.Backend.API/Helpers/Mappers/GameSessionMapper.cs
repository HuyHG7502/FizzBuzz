using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Models.GameSession;

namespace FizzBuzz.Backend.API.Helpers.Mappers
{
    public static class GameSessionMapper
    {
        public static GameSession ToEntity(this StartSessionRequest dto)
            => new()
            {
                Id = Guid.NewGuid(),
                GameId = dto.GameId,
                Player = dto.Player,
                Duration = dto.Duration,
                StartedAt = DateTime.UtcNow,
            };

        public static SessionResponse ToSessionResponse(this GameSession session, Game game)
            => new()
            {
                SessionId = session.Id,
                GameId = game.Id,
                Game = game.Name,
                Player = session.Player,
                Duration = session.Duration,
                StartedAt = session.StartedAt,
                CompletedAt = session.CompletedAt,
                IsCompleted = session.IsCompleted,
                Rules = game.Rules.Select(r => r.ToDto()).ToList()
            };
    }
}

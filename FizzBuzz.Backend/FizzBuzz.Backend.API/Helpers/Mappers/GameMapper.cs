using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Models.Game;

namespace FizzBuzz.Backend.API.Helpers.Mappers
{
    public static class GameMapper
    {
        public static Game ToEntity(this CreateGameRequest dto)
            => new()
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Author = dto.Author,
                MinValue = dto.MinValue,
                MaxValue = dto.MaxValue,
                Rules = dto.Rules.Select(r => r.ToEntity()).ToList()
            };

        public static GameResponse ToGameResponse(this Game game)
            => new()
            {
                Id = game.Id,
                Name = game.Name,
                Author = game.Author,
                MinValue = game.MinValue,
                MaxValue = game.MaxValue,
                CreatedAt = game.CreatedAt,
                Rules = game.Rules.Select(r => r.ToDto()).ToList()
            };

        public static void UpdateFromDto(this Game game, CreateGameRequest dto)
        {
            game.Name = dto.Name;
            game.Author = dto.Author;
            game.MinValue = dto.MinValue;
            game.MaxValue = dto.MaxValue;
            game.Rules = dto.Rules.Select(r => r.ToEntity(game.Id)).ToList();
        }
    }
}

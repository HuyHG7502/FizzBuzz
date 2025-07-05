using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Models.GameRule;

namespace FizzBuzz.Backend.API.Helpers.Mappers
{
    public static class GameRuleMapper
    {
        public static GameRule ToEntity(this GameRuleDto dto, Guid? gameId = null)
            => new()
            {
                Divisor = dto.Divisor,
                Word = dto.Word,
                GameId = gameId ?? Guid.Empty
            };

        public static GameRuleDto ToDto(this GameRule rule)
            => new()
            {
                Divisor = rule.Divisor,
                Word = rule.Word,
            };
    }
}

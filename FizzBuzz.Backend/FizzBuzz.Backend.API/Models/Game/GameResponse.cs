using FizzBuzz.Backend.API.Models.GameRule;

namespace FizzBuzz.Backend.API.Models.Game
{
    public class GameResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GameRuleDto> Rules { get; set; } = [];
    }
}

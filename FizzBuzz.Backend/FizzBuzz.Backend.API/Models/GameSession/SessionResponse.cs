using FizzBuzz.Backend.API.Models.GameRule;

namespace FizzBuzz.Backend.API.Models.GameSession
{
    public class SessionResponse
    {
        public Guid SessionId { get; set; }
        public Guid GameId { get; set; }
        public string Game { get; set; } = string.Empty;
        public string Player { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsCompleted { get; set; } = false;
        public List<GameRuleDto> Rules { get; set; } = [];
    }
}

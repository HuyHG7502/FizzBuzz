using System.ComponentModel.DataAnnotations.Schema;

namespace FizzBuzz.Backend.API.Entities
{
    public class GameSession : BaseEntity
    {
        public Guid GameId { get; set; }
        public string Player { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int ScoreCorrect { get; set; }
        public int ScoreIncorrect { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        [NotMapped]
        public bool IsCompleted =>
            CompletedAt.HasValue && CompletedAt.Value <= DateTime.UtcNow;

        public Game Game { get; set; } = null!;
        public ICollection<GameAnswer> Answers { get; set; } = [];
    }
}

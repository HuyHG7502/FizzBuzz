namespace FizzBuzz.Backend.API.Entities
{
    public class GameAnswer : BaseEntity
    {
        public Guid SessionId { get; set; }
        public int Number { get; set; }
        public string PlayerAnswer { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public DateTime AnsweredAt { get; set; }

        public GameSession Session { get; set; } = null!;
    }
}

namespace FizzBuzz.Backend.API.Models.GameSession
{
    public class SessionResultResponse
    {
        public string Game { get; set; } = string.Empty;
        public string Player { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int ScoreCorrect { get; set; }
        public int ScoreIncorrect { get; set; }
        public int TotalNumbers { get; set; }
        public int TotalAnswers { get; set; }
        public double Accuracy { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}

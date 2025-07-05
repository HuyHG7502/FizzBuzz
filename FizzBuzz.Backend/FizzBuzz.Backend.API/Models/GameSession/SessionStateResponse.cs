namespace FizzBuzz.Backend.API.Models.GameSession
{
    public class SessionStateResponse
    {
        public int? Number { get; set; }
        public bool IsExhausted { get; set; }
        public bool IsCompleted { get; set; }
        public int ScoreCorrect { get; set; }
        public int ScoreIncorrect { get; set; }
        public int TotalNumbers { get; set; }
        public int TotalAnswers { get; set; }

        public int TimeRemaining { get; set; }

    }
}

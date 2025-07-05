namespace FizzBuzz.Backend.API.Models.GameAnswer
{
    public class AnswerResponse
    {
        public bool IsCorrect { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public string PlayerAnswer { get; set; } = string.Empty;

        public int ScoreCorrect { get; set; }
        public int ScoreIncorrect { get; set; }
        public bool IsGameCompleted { get; set; }
    }
}

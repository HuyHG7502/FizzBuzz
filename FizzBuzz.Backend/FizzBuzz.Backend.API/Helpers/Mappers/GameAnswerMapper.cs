using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Models.GameAnswer;

namespace FizzBuzz.Backend.API.Helpers.Mappers
{
    public static class GameAnswerMapper
    {
        public static GameAnswer ToEntity(this SubmitAnswerRequest dto, (string correctAnswer, bool isCorrect) validation)
            => new()
            {
                SessionId = dto.SessionId,
                Number = dto.Number,
                PlayerAnswer = dto.Answer,
                CorrectAnswer = validation.correctAnswer,
                IsCorrect = validation.isCorrect,
                AnsweredAt = DateTime.UtcNow
            };
    }
}

using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Helpers.Mappers;
using FizzBuzz.Backend.API.Models.Game;
using FizzBuzz.Backend.API.Models.GameAnswer;
using FizzBuzz.Backend.API.Models.GameSession;

namespace FizzBuzz.Backend.Tests.Fixtures
{
    public static class MockData
    {
        // Game mocks
        public static CreateGameRequest FizzBuzzRequest()
            => new()
            {
                Name = "FizzBuzz",
                Author = "Alice",
                MinValue = 1,
                MaxValue = 100,
                Rules =
                [
                    new() { Divisor = 3, Word = "Fizz "},
                    new() { Divisor = 5, Word = "Buzz" }
                ]
            };

        public static CreateGameRequest FooBooLooRequest()
            => new()
            {
                Name = "FooBooLoo",
                Author = "Bob",
                MinValue = 1,
                MaxValue = 500,
                Rules =
                [
                    new() { Divisor = 7, Word = "Foo "},
                    new() { Divisor = 11, Word = "Boo" },
                    new() { Divisor = 103, Word = "Loo" }
                ]
            };

        public static Game FizzBuzz()
            => FizzBuzzRequest().ToEntity();

        public static Game FooBooLoo()
            => FooBooLooRequest().ToEntity();

        // GameSession mocks
        public static StartSessionRequest FizzBuzzSessionRequest(Game? game = null)
            => new()
            {
                GameId = game?.Id ?? Guid.NewGuid(),
                Player = "Alice",
                Duration = 60
            };

        public static GameSession FizzBuzzSession(Game? game = null)
            => new()
            {
                Id = Guid.NewGuid(),
                GameId = game?.Id ?? Guid.NewGuid(),
                Game = game ?? FizzBuzz(),
                Player = "Alice",
                Duration = 60,
                StartedAt = DateTime.UtcNow,
                Answers = []
            };

        // GameAnswer mocks
        public static SubmitAnswerRequest FizzBuzzAnswerRequest(GameSession? session = null)
            => new()
            {
                SessionId = session?.Id ?? Guid.NewGuid(),
                Number = 10,
                Answer = "Buzz"
            };

        public static GameAnswer FizzBuzzAnswer(GameSession? session = null)
            => new()
            {
                Id = Guid.NewGuid(),
                SessionId = session?.Id ?? Guid.NewGuid(),
                Session = session ?? FizzBuzzSession(),
                Number = 10,
                PlayerAnswer = "Buzz",
                CorrectAnswer = "Buzz",
                IsCorrect = true,
                AnsweredAt = DateTime.UtcNow
            };
    }
}

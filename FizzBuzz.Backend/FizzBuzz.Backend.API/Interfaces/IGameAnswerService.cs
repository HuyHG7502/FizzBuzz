using FizzBuzz.Backend.API.Models.GameAnswer;

namespace FizzBuzz.Backend.API.Interfaces
{
    public interface IGameAnswerService
    {
        Task<AnswerResponse> SubmitAnswerAsync(SubmitAnswerRequest request);
    }
}

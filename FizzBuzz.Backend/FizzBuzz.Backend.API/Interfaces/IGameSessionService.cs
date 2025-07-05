using FizzBuzz.Backend.API.Models.GameSession;

namespace FizzBuzz.Backend.API.Interfaces
{
    public interface IGameSessionService
    {
        Task<SessionStateResponse> GetSessionStateAsync(Guid sessionId);
        Task<SessionResponse?> GetSessionAsync(Guid sessionId);
        Task<SessionResponse> StartSessionAsync(StartSessionRequest request);
        Task<SessionResultResponse> EndSessionAsync(Guid sessionId);
    }
}

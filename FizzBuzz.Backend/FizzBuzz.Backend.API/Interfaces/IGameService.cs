using FizzBuzz.Backend.API.Models.Game;

namespace FizzBuzz.Backend.API.Interfaces
{
    public interface IGameService
    {
        Task<IEnumerable<GameResponse>> GetAllGamesAsync();
        Task<GameResponse?> GetGameByIdAsync(Guid gameId);
        Task<GameResponse> CreateGameAsync(CreateGameRequest request);
        Task<GameResponse> UpdateGameAsync(Guid gameId, CreateGameRequest request);
        Task<bool> DeleteGameAsync(Guid gameId);
    }
}

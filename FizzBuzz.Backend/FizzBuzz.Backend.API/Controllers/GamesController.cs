using FizzBuzz.Backend.API.Helpers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Models.Game;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzz.Backend.API.Controllers
{
    [Route("api/games")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;
        public GamesController(IGameService gameService)
            => _gameService = gameService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<GameResponse>>>> GetAllGames()
        {
            var games = await _gameService.GetAllGamesAsync();
            return Ok(ApiResponse<IEnumerable<GameResponse>>.Success(games));
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ApiResponse<GameResponse>>> GetGameById(Guid id)
        {
            var game = await _gameService.GetGameByIdAsync(id);
            if (game == null)
                return NotFound(ApiResponse<GameResponse>.Error("Game not found"));

            return Ok(ApiResponse<GameResponse>.Success(game));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<GameResponse>>> CreateGame([FromBody] CreateGameRequest request)
        {
            var game = await _gameService.CreateGameAsync(request);
            return CreatedAtAction(nameof(GetGameById), new { id = game.Id }, ApiResponse<GameResponse>.Success(game));
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ApiResponse<GameResponse>>> UpdateGame(Guid id, [FromBody] CreateGameRequest request)
        {
            var updated = await _gameService.UpdateGameAsync(id, request);
            if (updated == null)
                return NotFound(ApiResponse<GameResponse>.Error("Game not found"));

            return Ok(ApiResponse<GameResponse>.Success(updated));
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteGame(Guid id)
        {
            var deleted = await _gameService.DeleteGameAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<string>.Error("Game not found"));

            return Ok(ApiResponse<string>.Success("Game deleted"));
        }
    }
}

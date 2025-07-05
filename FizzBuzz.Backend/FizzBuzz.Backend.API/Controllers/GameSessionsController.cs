using FizzBuzz.Backend.API.Helpers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Models.GameAnswer;
using FizzBuzz.Backend.API.Models.GameSession;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzz.Backend.API.Controllers
{
    [Route("api/sessions")]
    [ApiController]
    public class GameSessionsController : ControllerBase
    {
        private readonly IGameSessionService _sessionService;
        private readonly IGameAnswerService _answerService;

        public GameSessionsController(IGameSessionService sessionService, IGameAnswerService answerService)
            => (_sessionService, _answerService) = (sessionService, answerService);

        [HttpPost("start")]
        public async Task<ActionResult<ApiResponse<SessionResponse>>> StartSession([FromBody] StartSessionRequest request)
        {
            var session = await _sessionService.StartSessionAsync(request);
            return Ok(ApiResponse<SessionResponse>.Success(session));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ApiResponse<SessionResponse>>> GetSession(Guid id)
        {
            var session = await _sessionService.GetSessionAsync(id);
            if (session == null)
                return NotFound(ApiResponse<SessionResponse>.Error("Session not found"));

            return Ok(ApiResponse<SessionResponse>.Success(session));
        }

        [HttpGet("{id:guid}/question")]
        public async Task<ActionResult<ApiResponse<SessionStateResponse>>> GetSessionState(Guid id)
        {
            var state = await _sessionService.GetSessionStateAsync(id);
            return Ok(ApiResponse<SessionStateResponse>.Success(state));
        }

        [HttpGet("{id:guid}/results")]
        public async Task<ActionResult<ApiResponse<SessionResultResponse>>> GetSessionResults(Guid id)
        {
            var results = await _sessionService.EndSessionAsync(id);
            return Ok(ApiResponse<SessionResultResponse>.Success(results));
        }

        [HttpPost("{id:guid}/answer")]
        public async Task<ActionResult<ApiResponse<SessionStateResponse>>> SubmitAnswer(Guid id, [FromBody] SubmitAnswerRequest request)
        {
            if (id != request.SessionId)
                return BadRequest(ApiResponse<SessionStateResponse>.Error("Session ID mismatch"));

            var answer = await _answerService.SubmitAnswerAsync(request);
            var session = await _sessionService.GetSessionStateAsync(id);

            return Ok(ApiResponse<SessionStateResponse>.Success(session));
        }

        [HttpPost("{id:guid}/end")]
        public async Task<ActionResult<ApiResponse<SessionResultResponse>>> EndSession(Guid id)
        {
            var ended = await _sessionService.EndSessionAsync(id);
            return Ok(ApiResponse<SessionResultResponse>.Success(ended));
        }
    }
}

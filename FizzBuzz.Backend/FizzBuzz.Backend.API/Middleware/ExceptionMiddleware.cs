using FizzBuzz.Backend.API.Helpers;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace FizzBuzz.Backend.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, IHostEnvironment env, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _env = env;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Continue request pipeline
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");

                context.Response.ContentType = "application/json";

                var (statusCode, message) = ex switch
                {
                    KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
                    UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
                    ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
                    ValidationException => (HttpStatusCode.BadRequest, ex.Message),
                    InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
                    DbUpdateException => (HttpStatusCode.Conflict, "Database update error occurred"),
                    TaskCanceledException => (HttpStatusCode.RequestTimeout, "Request timed out"),
                    _ => (HttpStatusCode.InternalServerError, _env.IsDevelopment() ? ex.Message : "An unexpected error occurred")
                };

                context.Response.StatusCode = (int)statusCode;

                var response = ApiResponse<string>.Error(message);
                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}

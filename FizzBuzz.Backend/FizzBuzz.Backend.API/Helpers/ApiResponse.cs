namespace FizzBuzz.Backend.API.Helpers
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; } = string.Empty;
        public List<string>? Errors { get; set; } = [];

        public static ApiResponse<T> Success(T data, string message = "Success")
            => new() { Data = data, Message = message };

        public static ApiResponse<T> Success(string message = "Success")
            => new() { Message = message };

        public static ApiResponse<T> Error(string error, string message = "An error occurred")
            => new() { Errors = [error], Message = message };

        public static ApiResponse<T> Error(List<string> errors, string message = "An error occurred")
            => new() { Errors = errors, Message = message };
    }
}

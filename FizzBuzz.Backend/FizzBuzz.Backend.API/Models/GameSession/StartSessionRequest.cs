using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.API.Models.GameSession
{
    public class StartSessionRequest
    {
        [Required]
        public Guid GameId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Player { get; set; } = string.Empty;
        
        public int Duration { get; set; }
    }
}

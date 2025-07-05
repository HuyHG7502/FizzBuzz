using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.API.Models.GameAnswer
{
    public class SubmitAnswerRequest
    {
        [Required]
        public Guid SessionId { get; set; }

        [Required]
        public int Number { get; set; }

        [Required]
        [MaxLength(200)]
        public string Answer { get; set; } = string.Empty;
    }
}

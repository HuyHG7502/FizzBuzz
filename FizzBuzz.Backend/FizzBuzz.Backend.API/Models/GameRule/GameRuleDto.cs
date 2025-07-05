using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.API.Models.GameRule
{
    public class GameRuleDto
    {
        [Range(2, int.MaxValue)]
        public int Divisor { get; set; }

        [Required]
        [MaxLength(50)]
        public string Word { get; set; } = string.Empty;
    }
}

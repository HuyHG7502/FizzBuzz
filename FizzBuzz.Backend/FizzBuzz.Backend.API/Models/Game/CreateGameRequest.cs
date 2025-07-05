using FizzBuzz.Backend.API.Models.GameRule;
using System.ComponentModel.DataAnnotations;

namespace FizzBuzz.Backend.API.Models.Game
{
    public class CreateGameRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int MinValue { get; set; }

        [Range(1, int.MaxValue)]
        public int MaxValue { get; set; }

        [Required]
        [MinLength(1)]
        public List<GameRuleDto> Rules { get; set; } = [];
    }
}

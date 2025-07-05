namespace FizzBuzz.Backend.API.Entities
{
    public class GameRule : BaseEntity
    {
        public int Divisor { get; set; }
        public string Word { get; set; } = string.Empty;

        public Guid GameId { get; set; }
        public Game Game { get; set; } = null!;
    }
}

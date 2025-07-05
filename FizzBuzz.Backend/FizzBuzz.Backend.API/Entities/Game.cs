namespace FizzBuzz.Backend.API.Entities
{
    public class Game : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; }= string.Empty;
        public int MinValue { get; set; } = 1;
        public int MaxValue { get; set; } = 100;
        public ICollection<GameRule> Rules { get; set; } = [];
    }
}

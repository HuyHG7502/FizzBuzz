using FizzBuzz.Backend.API.Entities;
using FizzBuzz.Backend.API.Interfaces;

namespace FizzBuzz.Backend.API.Services
{
    public class FizzBuzzEngine : IFizzBuzzEngine
    {
        public string Compute(int number, List<GameRule> rules)
        {
            var result = string.Empty;

            foreach (var rule in rules.OrderBy(r => r.Divisor))
            {
                if (number % rule.Divisor == 0)
                    result += rule.Word;
            }

            return string.IsNullOrWhiteSpace(result) ? number.ToString() : result;
        }

        public bool Validate(int number, string answer, List<GameRule> rules)
        {
            var expected = Compute(number, rules);
            return string.Equals(expected.Trim(), answer.Trim(), StringComparison.OrdinalIgnoreCase);
        }
    }
}

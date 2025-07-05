using FizzBuzz.Backend.API.Entities;

namespace FizzBuzz.Backend.API.Interfaces
{
    public interface IFizzBuzzEngine
    {
        string Compute(int number, List<GameRule> rules);
        bool Validate(int number, string answer, List<GameRule> rules);
    }
}

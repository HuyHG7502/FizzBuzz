
using FizzBuzz.Backend.API.Data;
using FizzBuzz.Backend.API.Helpers;
using FizzBuzz.Backend.API.Interfaces;
using FizzBuzz.Backend.API.Middleware;
using FizzBuzz.Backend.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace FizzBuzz.Backend.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            ConfigureServices(builder.Services, builder.Configuration);
            ConfigureCors(builder.Services);

            var app = builder.Build();

            await ConfigurePipeline(app);

            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            // Basic services
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "FizzBuzz API", Version = "v1" });
                c.AddServer(new OpenApiServer { Url = "http://localhost:8080" });
            });

            // Database
            services.AddDbContext<GameDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            // Application services
            ConfigureAppServices(services);
        }

        private static void ConfigureAppServices(IServiceCollection services)
        {
            services.AddScoped<IFizzBuzzEngine, FizzBuzzEngine>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IGameAnswerService, GameAnswerService>();
            services.AddScoped<IGameSessionService, GameSessionService>();
        }

        private static void ConfigureCors(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", builder =>
                {
                    builder
                        .WithOrigins("http://localhost:3000", "http://ui:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }

        private static async Task ConfigurePipeline(WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FizzBuzz API V1");
                });

                // Seed data in development
                await SeedData(app);
            }

            // Global middleware pipeline
            app.UseCors("AllowFrontend");
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.MapControllers();
        }

        private static async Task SeedData(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<GameDbContext>();

            // Apply migrations
            await dbContext.Database.MigrateAsync();

            var seedPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "games.json");
            await DataSeeder.SeedAsync(dbContext, seedPath);
        }
    }
}

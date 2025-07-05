# ----- Stage 1: Build the application -----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY FizzBuzz.Backend.sln ./
COPY FizzBuzz.Backend.API/FizzBuzz.Backend.API.csproj ./FizzBuzz.Backend.API/
COPY FizzBuzz.Backend.Tests/FizzBuzz.Backend.Tests.csproj ./FizzBuzz.Backend.Tests/

# Restore dependencies
RUN dotnet restore FizzBuzz.Backend.sln

# Copy full source code
COPY FizzBuzz.Backend.API ./FizzBuzz.Backend.API/
WORKDIR /src/FizzBuzz.Backend.API

# Publish the application
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# ----- Stage 2: Run the application -----
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish ./
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "FizzBuzz.Backend.API.dll"]
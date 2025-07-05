# FizzBuzz Arena

A full-stack FizzBuzz game platform built with **Next.js (TypeScript)** for the frontend and **.NET 9 + PostgreSQL** for the backend.

FizzBuzz Arena is a modern web application that lets users **create, play, and share custom FizzBuzz-inspired games**. The platform is designed for both fun and learning, allowing users to define their own rules, challenge themselves, and compete with others.

---

## 📁 Project Structure

```bash
FizzBuzz
├── FizzBuzz.Frontend/ # Next.js frontend
│   ├── __tests__
│   ├── src
│   └── Dockerfile
│
├── FizzBuzz.Backend/ # .NET backend (API, EF Core, etc.)
│   ├── FizzBuzz.Backend/API
│   ├── FizzBuzz.Backend/Tests
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (with Docker Compose)

### **Prerequisites**

- [Docker](https://www.docker.com/products/docker-desktop) (or Docker Engine)
- [Node.js](https://nodejs.org/) (for local dev, optional)
- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0) (for local dev, optional)

### 1. **Clone the repository**

```sh
git clone https://github.com/HuyHG7502/FizzBuzz.git
cd FizzBuzz
```

### 2. **Run everything with Docker Compose**

```sh
docker compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **PostgreSQL:** localhost:5432 (user: `postgres`, password: `password`)

---

## 🖥️ Local Development

### **Frontend (Next.js)**

```sh
cd FizzBuzz.Frontend
# Install dependencies
npm install
# or
yarn install

# Start dev server (with hot reload)
npm run dev
# or
yarn dev

# Open http://localhost:3000
```

- Configure API URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### **Backend (ASP.NET Core + PostgreSQL)**

```sh
cd FizzBuzz.Backend

# Restore and run
dotnet restore
dotnet run --project FizzBuzz.Backend.API

# API runs at http://localhost:8080
```

- Connection string (in `appsettings.Development.json` or via env):

```
Host=localhost;Database=FizzBuzzDb;Username=postgres;Password=password
```

- **Apply EF Core migrations** (if needed):

```sh
dotnet ef database update --project FizzBuzz.Backend.API
```

---

## 🧪 Running Tests

### **Frontend**

```sh
cd FizzBuzz.Frontend
npm test
# or
yarn test
```

### **Backend**

```sh
cd FizzBuzz.Backend
dotnet test
```

---

## 🐳 Docker Compose Details

- **Frontend:** Next.js app served on port 3000
- **Backend:** .NET 9 API served on port 8080
- **Database:** PostgreSQL with persistent volume

To stop and remove containers:

```sh
docker compose down
```

---

## 🚧 Future Enhancements

We have many ideas to make FizzBuzz Arena even more powerful and fun! Here are some planned or potential enhancements:

### 1. Game History & User Profiles

- **User Accounts:** Allow users to register, log in, and manage their profiles.
- **Game History:** Track and display each user’s played games, scores, and performance over time.
- **Leaderboards:** Show top players, speed rounds, and most popular games.
- **Shareable Game Links:** Let users share custom games with friends.

### 2. Advanced Rule Engine (Beyond "Divisible By")

- **Flexible Rule Types:** Support rules based on other number properties, such as:
  - Contains digit (e.g., "contains 3")
  - Is a palindrome
  - Is a prime number
  - Is a perfect square/cube
  - Custom expressions (e.g., "sum of digits is 7", "digits map to colours")
- **Strategy Pattern for Rules:**  
  Refactor the backend rule logic to use the **Strategy Pattern**, allowing each rule type to be implemented as a separate strategy class. This will make it easy to add new rule types and keep the codebase maintainable and extensible.

---

**Have an idea?**  
Feel free to open an issue or contribute a feature!

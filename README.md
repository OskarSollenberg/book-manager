# Book Manager

A small book list with a .NET 10 Web API and a Next.js frontend. Books have an id, title, author and optional publication date. Data lives in memory for the lifetime of the API process.

## Run

Needs [.NET 10](https://dotnet.microsoft.com/download) and Node 24 (`nvm use` from the repo root).

```bash
# API — http://localhost:5231
cd backend
dotnet run --project src/BookManager.Api

# Frontend — http://localhost:3000
cd frontend
cp .env.example .env.local   # first time only
npm install
npm run dev
```

## Testing

Backend unit tests use xUnit. They cover `[NotBlank]` validation, `BookService` CRUD, and controller 201/404 responses.

```bash
cd backend
dotnet test
```

Each file is one class. Filter on the file name (without `.cs`) to run only that group:

```bash
cd backend
dotnet test --filter "FullyQualifiedName~NotBlankAttributeTests"
dotnet test --filter "FullyQualifiedName~BookServiceTests"
dotnet test --filter "FullyQualifiedName~BooksControllerTests"
```

## API

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/books` | List (cached 30s in memory) |
| `GET` | `/api/books/{id}` | 404 if missing |
| `POST` | `/api/books` | Title and author required |
| `PUT` | `/api/books/{id}` | Same validation; 404 if missing |
| `DELETE` | `/api/books/{id}` | 404 if missing |

Scratch requests: `backend/src/BookManager.Api/BookManager.Api.http`.

## Frontend

Next.js 16 (App Router) with TypeScript, React 19 and Tailwind CSS v4.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`. The default is `http://localhost:5231`.

## Layout

**Backend** — controller → `CachedBookService` → `BookService` → in-memory repository. Title/author are validated with `[NotBlank]`. Writes drop the list cache.

**Frontend** — `lib/api` (HTTP), `hooks/useBooks` (state), `components` (UI).

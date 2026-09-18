import type { Book, BookInput } from "@/types/book";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Ogiltig inmatning. Kontrollera fälten och försök igen.",
  404: "Den här boken hittades inte. Den kan redan ha tagits bort.",
};

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

/**
 * Validation failures arrive as ProblemDetails with a per-field `errors` map,
 * which carries the useful text; other failures only have `detail`/`title`.
 * Anything without a body falls back to a status-specific message.
 */
async function readErrorMessage(response: Response): Promise<string> {
  const problem: ProblemDetails | null = await response.json().catch(() => null);
  const fieldErrors = Object.values(problem?.errors ?? {}).flat();

  return (
    (fieldErrors.length > 0 ? fieldErrors.join("\n") : undefined) ??
    problem?.detail ??
    FALLBACK_MESSAGES[response.status] ??
    `Något gick fel (${response.status}).`
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(0, "Kunde inte nå servern. Är API:t igång?");
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export const getBooks = () => request<Book[]>("/api/books");

export const createBook = (input: BookInput) =>
  request<Book>("/api/books", { method: "POST", body: JSON.stringify(input) });

export const updateBook = (id: string, input: BookInput) =>
  request<void>(`/api/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteBook = (id: string) =>
  request<void>(`/api/books/${id}`, { method: "DELETE" });

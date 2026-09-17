export interface Book {
  id: string;
  title: string;
  author: string;
  publishedDate: string | null;
}

/** Payload for POST/PUT — the API owns the id. Mirrors BookInput on the backend. */
export type BookInput = Omit<Book, "id">;

"use client";

import { useState } from "react";
import { createBook, deleteBook, updateBook } from "@/lib/api/books";
import type { Book, BookInput } from "@/types/book";

/**
 * Owns the client-side book list, seeded by the server-rendered page.
 * Mutations hit the API first and only update local state on success,
 * so the list never shows something the backend rejected.
 */
export function useBooks(initialBooks: Book[]) {
  const [books, setBooks] = useState(initialBooks);

  async function add(input: BookInput) {
    const created = await createBook(input);
    setBooks((current) => [created, ...current]);
  }

  async function edit(id: string, input: BookInput) {
    await updateBook(id, input);
    setBooks((current) =>
      current.map((book) => (book.id === id ? { id, ...input } : book)),
    );
  }

  async function remove(id: string) {
    await deleteBook(id);
    setBooks((current) => current.filter((book) => book.id !== id));
  }

  return { books, add, edit, remove };
}

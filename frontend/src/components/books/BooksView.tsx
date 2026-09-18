"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useBooks } from "@/hooks/useBooks";
import type { Book, BookInput } from "@/types/book";
import { BookFormModal } from "./BookFormModal";
import { BookList } from "./BookList";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type Dialog =
  | { kind: "create" }
  | { kind: "edit"; book: Book }
  | { kind: "delete"; book: Book }
  | null;

const EMPTY_BOOK: BookInput = { title: "", author: "", publishedDate: null };

interface BooksViewProps {
  initialBooks: Book[];
  loadError?: string;
}

export function BooksView({ initialBooks, loadError }: BooksViewProps) {
  const { books, add, edit, remove } = useBooks(initialBooks);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeDialog() {
    setDialog(null);
    setError(null);
  }

  /** Every mutation shares one path: run it, close on success, surface the message on failure. */
  async function run(mutation: () => Promise<void>) {
    setIsPending(true);
    setError(null);

    try {
      await mutation();
      closeDialog();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Book list</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {books.length} {books.length === 1 ? "book" : "books"} in the
            collection
          </p>
        </div>

        <Button
          onClick={() => setDialog({ kind: "create" })}
          className="w-full sm:w-auto"
        >
          Add book
        </Button>
      </header>

      {loadError ? (
        <ErrorBanner>{loadError}</ErrorBanner>
      ) : (
        <BookList
          books={books}
          onEdit={(book) => setDialog({ kind: "edit", book })}
          onDelete={(book) => setDialog({ kind: "delete", book })}
        />
      )}

      {dialog?.kind === "create" && (
        <BookFormModal
          mode="create"
          initialValues={EMPTY_BOOK}
          isSaving={isPending}
          serverError={error}
          onSubmit={(values) => run(() => add(values))}
          onCancel={closeDialog}
        />
      )}

      {dialog?.kind === "edit" && (
        <BookFormModal
          mode="edit"
          initialValues={{
            title: dialog.book.title,
            author: dialog.book.author,
            publishedDate: dialog.book.publishedDate,
          }}
          isSaving={isPending}
          serverError={error}
          onSubmit={(values) => run(() => edit(dialog.book.id, values))}
          onCancel={closeDialog}
        />
      )}

      {dialog?.kind === "delete" && (
        <ConfirmDeleteDialog
          book={dialog.book}
          isDeleting={isPending}
          serverError={error}
          onConfirm={() => run(() => remove(dialog.book.id))}
          onCancel={closeDialog}
        />
      )}
    </main>
  );
}

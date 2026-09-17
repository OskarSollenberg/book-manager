import type { Book } from "@/types/book";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <p className="font-serif text-base font-semibold">Inga böcker ännu</p>
      <p className="max-w-xs text-sm text-text-secondary">
        Lägg till din första bok med knappen ovan för att komma igång.
      </p>
    </div>
  );
}

/*
  Mobile first: each book is a stacked card by default, and from `sm` up the
  same elements line up as columns. Author, date and actions are written once —
  only the flex direction changes — so there's no second markup tree to keep
  in sync with the first.
*/
export function BookList({ books, onEdit, onDelete }: BookListProps) {
  if (books.length === 0) return <EmptyState />;

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-surface">
      <li
        aria-hidden
        className="hidden items-center gap-4 border-b border-border bg-surface-alt px-5 py-3 text-xs font-medium uppercase tracking-wide text-text-secondary sm:flex"
      >
        <span className="flex-1">Titel</span>
        <span className="flex-1">Författare</span>
        <span className="w-40">Publicerad</span>
        <span className="w-40" />
      </li>

      {books.map((book) => (
        <li
          key={book.id}
          className="flex flex-col gap-1 border-b border-border px-4 py-4 last:border-0 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
        >
          <p className="min-w-0 flex-1 truncate font-serif text-[15px] font-medium">
            {book.title}
          </p>

          <p className="min-w-0 flex-1 truncate text-sm text-text-secondary">
            {book.author}
          </p>

          <p className="text-sm tabular-nums text-text-tertiary sm:w-40">
            {formatDate(book.publishedDate)}
          </p>

          <div className="mt-2 flex gap-2 sm:mt-0 sm:w-40 sm:justify-end">
            <button
              type="button"
              onClick={() => onEdit(book)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-accent transition hover:bg-accent-soft sm:border-0"
            >
              Redigera
            </button>
            <button
              type="button"
              onClick={() => onDelete(book)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-danger transition hover:bg-danger-soft sm:border-0"
            >
              Ta bort
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

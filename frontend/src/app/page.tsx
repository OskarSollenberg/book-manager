import { BooksView } from "@/components/books/BooksView";
import { getBooks } from "@/lib/api/books";

export default async function Home() {
  try {
    const books = await getBooks();
    return <BooksView initialBooks={books} />;
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Could not load books.";

    return <BooksView initialBooks={[]} loadError={message} />;
  }
}

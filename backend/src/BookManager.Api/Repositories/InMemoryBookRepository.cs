using System.Collections.Concurrent;
using BookManager.Api.Models;

namespace BookManager.Api.Repositories;

public class InMemoryBookRepository : IBookRepository
{
    private readonly ConcurrentDictionary<Guid, Book> _books = new();

    public InMemoryBookRepository()
    {
        Add(new Book
        {
            Id = Guid.Parse("8f14e45f-ceea-467a-9575-1f1c0e6a2b31"),
            Title = "Pippi Långstrump",
            Author = "Astrid Lindgren",
            PublishedDate = new DateOnly(1945, 11, 26)
        });

        Add(new Book
        {
            Id = Guid.Parse("c9f0f895-fb98-4b41-9b0c-1e0c0d6f3a22"),
            Title = "The Pragmatic Programmer",
            Author = "Andrew Hunt, David Thomas",
            PublishedDate = new DateOnly(1999, 10, 20)
        });
    }

    public IReadOnlyCollection<Book> GetAll() => _books.Values.ToList();

    public Book? GetById(Guid id) => _books.TryGetValue(id, out var book) ? book : null;

    public void Add(Book book) => _books[book.Id] = book;

    public bool Update(Book book) =>
        _books.TryGetValue(book.Id, out var existing) && _books.TryUpdate(book.Id, book, existing);

    public bool Delete(Guid id) => _books.TryRemove(id, out _);
}

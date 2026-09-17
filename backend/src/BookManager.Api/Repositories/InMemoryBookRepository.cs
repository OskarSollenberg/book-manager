using System.Collections.Concurrent;
using BookManager.Api.Models;

namespace BookManager.Api.Repositories;

public class InMemoryBookRepository : IBookRepository
{
    private readonly ConcurrentDictionary<Guid, Book> _books = new();

    public IReadOnlyCollection<Book> GetAll() => _books.Values.ToList();

    public Book? GetById(Guid id) => _books.TryGetValue(id, out var book) ? book : null;

    public void Add(Book book) => _books[book.Id] = book;

    public bool Update(Book book) =>
        _books.TryGetValue(book.Id, out var existing) && _books.TryUpdate(book.Id, book, existing);

    public bool Delete(Guid id) => _books.TryRemove(id, out _);
}

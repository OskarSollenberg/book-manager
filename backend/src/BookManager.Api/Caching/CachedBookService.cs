using BookManager.Api.Models;
using BookManager.Api.Services;
using Microsoft.Extensions.Caching.Memory;

namespace BookManager.Api.Caching;

/// <summary>
/// Caches the book list in front of another <see cref="IBookService"/>. The
/// inner service knows nothing about this, so caching can be swapped out — or
/// dropped — without touching the business logic.
/// </summary>
public class CachedBookService(IBookService inner, IMemoryCache cache) : IBookService
{
    private const string BooksKey = "books";

    // Short enough that a stale list can't linger, in case something writes to
    // the store without going through this class. Writes below evict anyway.
    private static readonly TimeSpan Ttl = TimeSpan.FromSeconds(30);

    public IReadOnlyCollection<Book> GetAll() =>
        cache.GetOrCreate(BooksKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = Ttl;

            return inner.GetAll();
        })!;

    // One book by id is a dictionary lookup, so caching it would cost more than
    // it saves. Only the list is cached.
    public Book? GetById(Guid id) => inner.GetById(id);

    public Book Create(BookInput input)
    {
        var book = inner.Create(input);
        cache.Remove(BooksKey);

        return book;
    }

    // Evict only on a real change, so a 404 leaves a warm cache alone.
    public bool Update(Guid id, BookInput input) => Evict(inner.Update(id, input));

    public bool Delete(Guid id) => Evict(inner.Delete(id));

    private bool Evict(bool changed)
    {
        if (changed)
        {
            cache.Remove(BooksKey);
        }

        return changed;
    }
}

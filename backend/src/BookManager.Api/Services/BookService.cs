using BookManager.Api.Models;
using BookManager.Api.Repositories;

namespace BookManager.Api.Services;

public class BookService(IBookRepository repository) : IBookService
{
    public IReadOnlyCollection<Book> GetAll() => repository.GetAll();

    public Book? GetById(Guid id) => repository.GetById(id);

    public Book Create(BookInput input)
    {
        var book = ToBook(Guid.NewGuid(), input);
        repository.Add(book);

        return book;
    }

    public bool Update(Guid id, BookInput input) => repository.Update(ToBook(id, input));

    public bool Delete(Guid id) => repository.Delete(id);

    // The id always comes from the route, never from the payload, so a client
    // can't point an update at a different book than the URL says.
    private static Book ToBook(Guid id, BookInput input) => new()
    {
        Id = id,
        Title = input.Title.Trim(),
        Author = input.Author.Trim(),
        PublishedDate = input.PublishedDate
    };
}

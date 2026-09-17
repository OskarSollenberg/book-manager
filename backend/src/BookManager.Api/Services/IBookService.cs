using BookManager.Api.Models;

namespace BookManager.Api.Services;

/// <summary>
/// Book operations, independent of HTTP. The controller translates these
/// results into status codes.
/// </summary>
public interface IBookService
{
    IReadOnlyCollection<Book> GetAll();

    Book? GetById(Guid id);

    Book Create(BookInput input);

    /// <returns>False when no book with that id exists.</returns>
    bool Update(Guid id, BookInput input);

    /// <returns>False when no book with that id exists.</returns>
    bool Delete(Guid id);
}

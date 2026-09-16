using BookManager.Api.Models;

namespace BookManager.Api.Repositories;

public interface IBookRepository
{
    IReadOnlyCollection<Book> GetAll();

    Book? GetById(Guid id);

    void Add(Book book);

    bool Update(Book book);

    bool Delete(Guid id);
}

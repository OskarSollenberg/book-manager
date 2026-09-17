using BookManager.Api.Models;
using BookManager.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BookManager.Api.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController(IBookRepository repository) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Book>> GetAll() => Ok(repository.GetAll());

    [HttpGet("{id}")]
    public ActionResult<Book> GetById(Guid id)
    {
        var book = repository.GetById(id);

        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public ActionResult<Book> Create(BookInput input)
    {
        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = input.Title,
            Author = input.Author,
            PublishedDate = input.PublishedDate
        };

        repository.Add(book);

        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, BookInput input)
    {
        var book = new Book
        {
            Id = id,
            Title = input.Title,
            Author = input.Author,
            PublishedDate = input.PublishedDate
        };

        return repository.Update(book) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id) => repository.Delete(id) ? NoContent() : NotFound();
}

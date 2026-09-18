using BookManager.Api.Models;
using BookManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookManager.Api.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController(IBookService service) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Book>> GetAll() => Ok(service.GetAll());

    [HttpGet("{id}")]
    public ActionResult<Book> GetById(Guid id)
    {
        var book = service.GetById(id);

        return book is null ? BookNotFound() : Ok(book);
    }

    [HttpPost]
    public ActionResult<Book> Create(BookInput input)
    {
        var book = service.Create(input);

        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, BookInput input) =>
        service.Update(id, input) ? NoContent() : BookNotFound();

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id) =>
        service.Delete(id) ? NoContent() : BookNotFound();

    private ObjectResult BookNotFound() =>
        Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "This book was not found.",
            detail: "This book was not found. It may already have been removed — reload the page to see the current list.");
}

using BookManager.Api.Controllers;
using BookManager.Api.Models;
using BookManager.Api.Repositories;
using BookManager.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookManager.Api.Tests;

/// <summary>
/// The controller only translates service results into status codes, so that
/// translation is all these cover. Validation is the framework's job and is
/// tested through <see cref="NotBlankAttributeTests"/> instead.
/// </summary>
public class BooksControllerTests
{
    // The chain Program.cs wires at startup, built by hand. No server involved.
    private readonly BooksController _controller = new(new BookService(new InMemoryBookRepository()));

    private static BookInput Input() => new() { Title = "Kallocain", Author = "Karin Boye" };

    // Expects 201 and the saved book in the body, so the client gets its id back.
    [Fact]
    public void Create_returns_201_with_the_new_book()
    {
        var result = Assert.IsType<CreatedAtActionResult>(_controller.Create(Input()).Result);

        Assert.Equal(StatusCodes.Status201Created, result.StatusCode);
        Assert.IsType<Book>(result.Value);
    }

    // A missing book is a client error, not an empty 200.
    [Fact]
    public void GetById_returns_404_for_an_unknown_id() =>
        AssertBookNotFound(_controller.GetById(Guid.NewGuid()).Result);

    // Editing a book someone else deleted must not silently succeed.
    [Fact]
    public void Update_returns_404_for_an_unknown_id() =>
        AssertBookNotFound(_controller.Update(Guid.NewGuid(), Input()));

    // Deleting a book that does not exist must not report success.
    [Fact]
    public void Delete_returns_404_for_an_unknown_id() =>
        AssertBookNotFound(_controller.Delete(Guid.NewGuid()));

    // Mirrors the BookNotFound helper the three actions share in the controller.
    private static void AssertBookNotFound(IActionResult? result)
    {
        var objectResult = Assert.IsType<ObjectResult>(result);
        var problem = Assert.IsType<ProblemDetails>(objectResult.Value);

        Assert.Equal(StatusCodes.Status404NotFound, problem.Status);
        Assert.Equal("Boken hittades inte.", problem.Title);
    }
}

using BookManager.Api.Models;
using BookManager.Api.Repositories;
using BookManager.Api.Services;

namespace BookManager.Api.Tests;

public class BookServiceTests
{
    // The real repository is fast and side-effect free, so the tests assert on
    // stored state. xUnit builds a new instance per test, so it starts empty.
    private readonly BookService _service = new(new InMemoryBookRepository());

    private static BookInput Input(string title = "Kallocain", string author = "Karin Boye") =>
        new() { Title = title, Author = author, PublishedDate = new DateOnly(1940, 1, 1) };

    // ----- Create -----

    // Guid.Empty would make every book share one key.
    [Fact]
    public void Create_assigns_an_id()
    {
        var book = _service.Create(Input());

        Assert.NotEqual(Guid.Empty, book.Id);
    }

    // One entry, and it matches what Create returned.
    [Fact]
    public void Create_stores_the_book()
    {
        var book = _service.Create(Input());

        Assert.Equal(book, Assert.Single(_service.GetAll()));
    }

    // Validation lets padding through; stripping it is the service's job.
    [Fact]
    public void Create_trims_title_and_author()
    {
        var book = _service.Create(Input("  Kallocain  ", "  Karin Boye  "));

        Assert.Equal("Kallocain", book.Title);
        Assert.Equal("Karin Boye", book.Author);
    }

    // ----- Reading -----

    // Empty list, not null — the frontend reads .length off it.
    [Fact]
    public void GetAll_is_empty_to_begin_with() => Assert.Empty(_service.GetAll());

    // Null becomes a 404 in the controller.
    [Fact]
    public void GetById_returns_null_for_an_unknown_id() =>
        Assert.Null(_service.GetById(Guid.NewGuid()));

    // ----- Update -----

    // Reads back, so a lying return value can't pass.
    [Fact]
    public void Update_replaces_the_stored_book()
    {
        var book = _service.Create(Input());

        var updated = _service.Update(book.Id, Input("Ångest", "Pär Lagerkvist"));

        Assert.True(updated);
        Assert.Equal("Ångest", _service.GetById(book.Id)!.Title);
    }

    // The route id is reused, so no second entry appears.
    [Fact]
    public void Update_keeps_the_original_id()
    {
        var book = _service.Create(Input());

        _service.Update(book.Id, Input("Ångest"));

        Assert.Equal(book.Id, Assert.Single(_service.GetAll()).Id);
    }

    // False becomes a 404 in the controller.
    [Fact]
    public void Update_returns_false_for_an_unknown_id() =>
        Assert.False(_service.Update(Guid.NewGuid(), Input()));

    // ----- Delete -----

    // Reports success, and the store is actually empty after.
    [Fact]
    public void Delete_removes_the_book()
    {
        var book = _service.Create(Input());

        Assert.True(_service.Delete(book.Id));
        Assert.Empty(_service.GetAll());
    }

    // Same 404 path as a failed update.
    [Fact]
    public void Delete_returns_false_for_an_unknown_id() =>
        Assert.False(_service.Delete(Guid.NewGuid()));
}

namespace BookManager.Api.Models;

public record Book
{
    public required Guid Id { get; init; }

    public required string Title { get; init; }

    public required string Author { get; init; }

    public DateOnly? PublishedDate { get; init; }
}

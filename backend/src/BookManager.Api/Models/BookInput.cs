namespace BookManager.Api.Models;

public record BookInput
{
    public required string Title { get; init; }

    public required string Author { get; init; }

    public DateOnly? PublishedDate { get; init; }
}

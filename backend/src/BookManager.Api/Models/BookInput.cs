using BookManager.Api.Validation;

namespace BookManager.Api.Models;

/// <summary>
/// Client payload for create and update. Has no Id — the server assigns that.
/// Fields default to empty rather than being `required`, so a missing field
/// reaches our validation instead of failing during deserialization.
/// </summary>
public record BookInput
{
        [NotBlank(ErrorMessage = "Title is required.")]
        public string Title { get; init; } = string.Empty;

        [NotBlank(ErrorMessage = "Author is required.")]
    public string Author { get; init; } = string.Empty;

    public DateOnly? PublishedDate { get; init; }
}

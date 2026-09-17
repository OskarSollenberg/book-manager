using System.ComponentModel.DataAnnotations;

namespace BookManager.Api.Validation;

/// <summary>
/// Requires a non-empty string. Unlike [Required], a value of only whitespace
/// is rejected too — "   " is a missing title, not a title.
/// </summary>
public sealed class NotBlankAttribute : ValidationAttribute
{
    public override bool IsValid(object? value) =>
        value is string text && !string.IsNullOrWhiteSpace(text);
}

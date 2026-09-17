using BookManager.Api.Validation;

namespace BookManager.Api.Tests;

public class NotBlankAttributeTests
{
    private readonly NotBlankAttribute _attribute = new();

    // Four ways a required field arrives missing: absent, empty, spaces, tabs.
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("\t\n")]
    public void Rejects_null_empty_and_whitespace(string? value) =>
        Assert.False(_attribute.IsValid(value));

    // Without this, an attribute that always said no would pass every test above.
    [Fact]
    public void Accepts_text() => Assert.True(_attribute.IsValid("Kallocain"));

    // Testing that text is a title; removing the padding is the service's job.
    [Fact]
    public void Accepts_padded_text() => Assert.True(_attribute.IsValid("  Kallocain  "));

    // IsValid takes object?, so a number must be rejected rather than throwing.
    [Fact]
    public void Rejects_values_that_are_not_text() => Assert.False(_attribute.IsValid(42));
}

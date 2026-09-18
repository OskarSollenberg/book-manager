using BookManager.Api.Caching;
using BookManager.Api.Repositories;
using BookManager.Api.Services;
using Microsoft.Extensions.Caching.Memory;

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

// Singleton: the in-memory store *is* the database, so it must outlive requests.
builder.Services.AddSingleton<IBookRepository, InMemoryBookRepository>();

// BookService is registered by its concrete type so the decorator can ask for
// it; everything else resolves IBookService and gets the cached one.
builder.Services.AddMemoryCache();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<IBookService>(provider => new CachedBookService(
    provider.GetRequiredService<BookService>(),
    provider.GetRequiredService<IMemoryCache>()));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});




var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(FrontendCorsPolicy);

app.MapControllers();

app.Run();
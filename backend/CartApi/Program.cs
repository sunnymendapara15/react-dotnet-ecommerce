using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5000");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddSingleton<ProductCatalog>();
builder.Services.AddSingleton<CartState>();

var app = builder.Build();

app.UseCors("AllowReact");

app.MapGet("/api/products", (ProductCatalog catalog, CartState cart) =>
{
    var products = catalog.Products
        .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.ImageUrl, cart.Contains(p.Id)))
        .ToList();
    return Results.Ok(products);
});

app.MapGet("/api/cart", (ProductCatalog catalog, CartState cart) =>
{
    var items = catalog.Products
        .Where(p => cart.Contains(p.Id))
        .Select(p => new CartItemDto(p.Id, p.Name, p.Price))
        .ToList();

    var subtotal = items.Sum(p => p.Price);
    return Results.Ok(new { items, subtotal, total = subtotal });
});

app.MapPost("/api/cart/select", ([FromBody] CartRequest request, ProductCatalog catalog, CartState cart) =>
{
    if (!catalog.Products.Any(p => p.Id == request.ProductId))
    {
        return Results.NotFound(new { message = "Product not found" });
    }

    cart.Select(request.ProductId);
    return Results.Ok(new { request.ProductId, selected = true });
});

app.MapPost("/api/cart/unselect", ([FromBody] CartRequest request, ProductCatalog catalog, CartState cart) =>
{
    if (!catalog.Products.Any(p => p.Id == request.ProductId))
    {
        return Results.NotFound(new { message = "Product not found" });
    }

    cart.Unselect(request.ProductId);
    return Results.Ok(new { request.ProductId, selected = false });
});

app.Run();

internal sealed record Product(int Id, string Name, string Description, decimal Price, string ImageUrl);

internal sealed record ProductDto(int Id, string Name, string Description, decimal Price, string ImageUrl, bool Selected);

internal sealed record CartItemDto(int Id, string Name, decimal Price);

internal sealed record CartRequest(int ProductId);

internal sealed class ProductCatalog
{
    public List<Product> Products { get; } = new()
    {
        new(1, "Aurora Wireless Speaker", "Premium sound, woven fabric, and 12 hr battery.", 129.00m, "https://images.unsplash.com/photo-1518449002157-247b1502b54d?auto=format&fit=crop&w=600&q=80"),
        new(2, "Velvet Comfort Chair", "Soft seating for modern living rooms.", 349.00m, "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=600&q=80"),
        new(3, "Mountain Trail Backpack", "Weather-resistant with organized pockets.", 89.00m, "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=600&q=80"),
        new(4, "Craft Espresso Set", "Double-shot perfection in one artisan kit.", 72.50m, "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=600&q=80"),
        new(5, "Nocturne Task Lamp", "Adjustable warm light for desks and bedside tables.", 64.00m, "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80")
    };
}

internal sealed class CartState
{
    private readonly HashSet<int> _selectedProducts = new();
    private readonly object _lock = new();

    public bool Contains(int productId)
    {
        lock (_lock)
        {
            return _selectedProducts.Contains(productId);
        }
    }

    public void Select(int productId)
    {
        lock (_lock)
        {
            _selectedProducts.Add(productId);
        }
    }

    public void Unselect(int productId)
    {
        lock (_lock)
        {
            _selectedProducts.Remove(productId);
        }
    }
}

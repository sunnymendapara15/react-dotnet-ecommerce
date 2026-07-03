import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyIds, setBusyIds] = useState(new Set());

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) {
        throw new Error('Unable to load products. Please ensure the backend is running.');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSelection = async (productId, currentlySelected) => {
    setBusyIds((prev) => new Set(prev).add(productId));
    setError(null);

    try {
      const target = currentlySelected ? 'unselect' : 'select';
      const response = await fetch(`${API_BASE}/cart/${target}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Unable to update your cart.');
      }

      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <h2>Product Listing</h2>
        <p>Select or deselect items to keep your cart in sync.</p>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
            <div className="product-body">
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="product-footer">
                <span className="price">${product.price.toFixed(2)}</span>
                <button
                  type="button"
                  className={product.selected ? 'pill danger' : 'pill primary'}
                  disabled={busyIds.has(product.id)}
                  onClick={() => toggleSelection(product.id, product.selected)}
                >
                  {product.selected ? 'Remove from cart' : 'Add to cart'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductListingPage;

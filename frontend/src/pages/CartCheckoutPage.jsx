import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

function CartCheckoutPage() {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/cart`);
      if (!response.ok) {
        throw new Error('Unable to load the cart.');
      }

      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    setRemovingId(productId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/cart/unselect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Unable to remove that item.');
      }

      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <h2>Cart / Checkout</h2>
        <p>All selections are persisted on the backend so the cart page always reflects your current choices.</p>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {loading ? (
        <p>Loading cart...</p>
      ) : cart.items.length === 0 ? (
        <p className="muted">Your cart is empty. Start adding products on the listing page.</p>
      ) : (
        <div className="cart-list">
          {cart.items.map((item) => (
            <article key={item.id} className="cart-row">
              <div>
                <p className="cart-name">{item.name}</p>
                <p className="cart-price">${item.price.toFixed(2)}</p>
              </div>
              <button
                type="button"
                className="pill danger"
                disabled={removingId === item.id}
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </article>
          ))}

          <div className="cart-summary">
            <label>Subtotal</label>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary">
            <label>Total</label>
            <strong>${cart.total.toFixed(2)}</strong>
          </div>
          <button type="button" className="pill primary" disabled>
            🚧 Checkout (mock)
          </button>
        </div>
      )}
    </section>
  );
}

export default CartCheckoutPage;

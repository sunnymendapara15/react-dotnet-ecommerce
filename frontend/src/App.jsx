import { NavLink, Routes, Route } from 'react-router-dom';
import ProductListingPage from './pages/ProductListingPage.jsx';
import CartCheckoutPage from './pages/CartCheckoutPage.jsx';

const navLinkClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link';

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">React + .NET Ecommerce Demo</p>
          <h1>Shop a curated catalog and manage your cart.</h1>
        </div>
        <nav className="nav-links">
          <NavLink to="/" className={navLinkClass} end>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart &amp; Checkout
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/cart" element={<CartCheckoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

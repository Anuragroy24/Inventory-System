import React from 'react';
import './Header.css';

export default function Header({ currentView = 'catalog', onNavigate = () => {} }) {
  const Link = ({ view, children }) => (
    <a
      href="#"
      className={currentView === view ? 'active' : ''}
      onClick={(e) => { e.preventDefault(); onNavigate(view); }}
    >
      {children}
    </a>
  );

  return (
    <header className="site-header">
      <div className="brand">
        <div className="logo">🛍️</div>
        <div className="brand-text">
          <div className="title">Inventory Shop</div>
          <div className="subtitle">Simple • Fast • Reliable</div>
        </div>
      </div>
      <nav className="nav">
        <Link view="catalog">Catalog</Link>
        <Link view="cart">Cart</Link>
        <Link view="orders">Orders</Link>
      </nav>
    </header>
  );
}

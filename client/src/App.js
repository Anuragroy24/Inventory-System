import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import OrderHistory from './components/OrderHistory';

const DEMO_USER_ID = 'demo-user-1';

function App() {
  const [cart, setCart] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'cart' | 'orders'

  const handleAddToCart = (product) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === product._id);
      if (idx > -1) {
        if (prev[idx].quantity < product.stock_quantity) {
          const updated = [...prev];
          updated[idx].quantity += 1;
          return updated;
        } else {
          return prev;
        }
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <>
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <div className="app-container">
        {/* <h1>Inventory System Demo</h1> */}
        {currentView === 'catalog' && (
          <ProductCatalog onAddToCart={handleAddToCart} cart={cart} setCart={setCart} />
        )}
        {currentView === 'cart' && (
          <ShoppingCart cart={cart} setCart={setCart} userId={DEMO_USER_ID} onOrderPlaced={(id) => { setLastOrderId(id); setCurrentView('orders'); }} />
        )}
        {currentView === 'orders' && (
          <OrderHistory userId={DEMO_USER_ID} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;

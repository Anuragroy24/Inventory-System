import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchLowStock, updateStock } from '../api';
import './ProductCatalog.css';

export default function ProductCatalog({ onAddToCart, cart = [], setCart = () => {} }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    (showLowStock ? fetchLowStock() : fetchProducts()).then(setProducts);
  }, [showLowStock]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCartQty = (productId) => {
    const item = cart.find(c => c._id === productId);
    return item ? item.quantity : 0;
  };

  const updateLocalProductStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock_quantity: newStock } : p));
  };

  const handleIncrement = async (product) => {
    if (product.stock_quantity <= 0) return;
    const newStock = product.stock_quantity - 1;
    updateLocalProductStock(product._id, newStock);
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === product._id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // persist to backend
    await updateStock(product._id, newStock);
  };

  const handleDecrement = async (product) => {
    const currentQty = getCartQty(product._id);
    if (currentQty <= 0) return;
    const newStock = product.stock_quantity + 1;
    updateLocalProductStock(product._id, newStock);
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === product._id);
      if (idx > -1) {
        const updated = [...prev];
        const nextQty = updated[idx].quantity - 1;
        if (nextQty <= 0) {
          updated.splice(idx, 1);
          return updated;
        }
        updated[idx] = { ...updated[idx], quantity: nextQty };
        return updated;
      }
      return prev;
    });
    // persist to backend
    await updateStock(product._id, newStock);
  };

  return (
    <div id="catalog">
      <h2>Product Catalog</h2>
      <div id="catalog-controls">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={e => setShowLowStock(e.target.checked)}
          />
          Show only low stock
        </label>
      </div>

      {filtered.length === 0 ? (
        <p style={{textAlign:'center',color:'#aaa'}}>No products found.</p>
      ) : (
        <div className="catalog-grid">
          {filtered.map(p => {
            const qty = getCartQty(p._id);
            return (
              <div key={p._id} className={`card ${p.stock_quantity < 10 ? 'low' : ''}`}>
                {p.stock_quantity < 10 && <div className="low-badge">Low stock</div>}
                <div className="name">{p.name}</div>
                <div className="sku">{p.sku}</div>
                <div className="price">${p.price.toFixed(2)}</div>
                <div className="stock">Stock: {p.stock_quantity}</div>
                <div className="category">{p.category_id?.name || ''}</div>
                <div className="actions">
                  {qty > 0 ? (
                    <div>
                      <button onClick={() => handleDecrement(p)}>-</button>
                      <span style={{ margin: '0 10px' }}>{qty}</span>
                      <button disabled={p.stock_quantity === 0} onClick={() => handleIncrement(p)}>+</button>
                    </div>
                  ) : (
                    <button disabled={p.stock_quantity === 0} onClick={() => handleIncrement(p)}>Add to Cart</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

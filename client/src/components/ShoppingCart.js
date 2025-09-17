import React, { useState } from 'react';
import { createOrder } from '../api';
import './ShoppingCart.css';

export default function ShoppingCart({ cart, setCart, userId, onOrderPlaced }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.10;
  const grandTotal = total + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const items = cart.map(i => ({ product_id: i._id, quantity: i.quantity }));
      const res = await createOrder({ user_id: userId, items });
      if (res.error) throw new Error(res.error);
      setSuccess('Order placed! Order ID: ' + res.order_id);
      alert('✅ Checkout successful! Order ID: ' + res.order_id);
      setCart([]);
      onOrderPlaced && onOrderPlaced(res.order_id);
    } catch (e) {
      setError(e.message);
      alert('❌ Checkout failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-state">Cart is empty.</div>
      ) : (
        <div className="cart-card">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td><span className="qty-badge">{item.quantity}</span></td>
                  <td>
                    <button onClick={() => setCart(cart.filter((_, i) => i !== idx))}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="summary-card">
        <div className="checkout-row">
          <div>
            <p>Subtotal: ${total.toFixed(2)}</p>
            <p>Tax (10%): ${tax.toFixed(2)}</p>
            <b>Total: ${grandTotal.toFixed(2)}</b>
          </div>
          <button className="checkout" disabled={cart.length === 0 || loading} onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}

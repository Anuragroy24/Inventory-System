import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../api';
import './OrderHistory.css';

export default function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchUserOrders(userId).then(setOrders);
  }, [userId]);

  const statusClass = (s) => {
    if (s === 'pending') return 'status-chip status-pending';
    if (s === 'fulfilled') return 'status-chip status-fulfilled';
    if (s === 'cancelled') return 'status-chip status-cancelled';
    return 'status-chip';
  };

  return (
    <div id="orders">
      <h2>Order History</h2>
      {orders.length === 0 ? <p className="empty">No orders found.</p> : (
        <div className="order-card">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td><span className={statusClass(order.status)}>{order.status}</span></td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

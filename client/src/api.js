const API_BASE = 'http://localhost:5000/api';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

export async function fetchLowStock() {
  const res = await fetch(`${API_BASE}/products/low-stock`);
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateStock(id, stock_quantity) {
  const res = await fetch(`${API_BASE}/products/${id}/stock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_quantity })
  });
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`);
  return res.json();
}

export async function fetchUserOrders(user_id) {
  const res = await fetch(`${API_BASE}/users/${user_id}/orders`);
  return res.json();
}

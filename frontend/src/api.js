const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const AI = import.meta.env.VITE_AI_URL || 'http://localhost:8000'

export const getMenu = () =>
  fetch(`${BASE}/menu`).then(r => r.json());

export const getOrders = () =>
  fetch(`${BASE}/orders`).then(r => r.json());

export const createOrder = (table_name, items) =>
  fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table_name, items })
  }).then(r => r.json());

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json());

export const getInventory = () =>
  fetch(`${BASE}/inventory`).then(r => r.json());

export const adjustInventory = (id, amount, action) =>
  fetch(`${BASE}/inventory/${id}/adjust`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, action })
  }).then(r => r.json());

export const addMenuItem = (item) =>
  fetch(`${BASE}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(r => r.json());

export const updateMenuPrice = (id, price) =>
  fetch(`${BASE}/menu/${id}/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price })
  }).then(r => r.json());
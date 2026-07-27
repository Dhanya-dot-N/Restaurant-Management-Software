const BASE = import.meta.env.VITE_API_URL || 'https://restaurant-management-software-23m6.onrender.com'
const AI = import.meta.env.VITE_AI_URL || 'https://restaurant-management-software-2.onrender.com'

export const getMenu = () =>
  fetch(`${BASE}/api/menu`).then(r => r.json());

export const getOrders = () =>
  fetch(`${BASE}/api/orders`).then(r => r.json());

export const createOrder = (table_name, items) =>
  fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table_name, items })
  }).then(r => r.json());

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json());

export const getInventory = () =>
  fetch(`${BASE}/api/inventory`).then(r => r.json());

export const adjustInventory = (id, amount, action) =>
  fetch(`${BASE}/api/inventory/${id}/adjust`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, action })
  }).then(r => r.json());

export const addMenuItem = (item) =>
  fetch(`${BASE}/api/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(r => r.json());

export const updateMenuPrice = (id, price) =>
  fetch(`${BASE}/api/menu/${id}/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price })
  }).then(r => r.json());

  export const getAnalytics = () =>
  fetch(`${BASE}/api/analytics/summary`).then(r => r.json())

  export const getInsights = async () => {
  return {
    insights: [
      "Sales increased by 15% today.",
      "Burger is the best-selling item.",
      "Table 5 has the highest order value.",
      "Inventory for Coke is running low."
    ]
  };
};

export const getForecast = async () => {
  return {
    forecast: {
      expectedOrders: 42,
      expectedRevenue: 18500,
      busyHours: ["12:00 PM", "1:00 PM", "7:00 PM", "8:00 PM"]
    }
  };
};
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "../types";
import { useShop } from "../context/ShopContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// BUG SHF-04: The useEffect that fetches order history is missing `user` in its
// dependency array. When the component mounts before the user has logged in,
// `user` is null and no fetch runs. When the user logs in and `user` changes,
// the effect does NOT re-run because it doesn't declare `user` as a dependency.
// Result: the order history page always shows "No orders" for users who log in
// after the page first mounts (e.g. navigating from the login page).
export function OrderHistoryPage() {
  const { user } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    axios
      .get<{ data: Order[] }>(`${API}/orders?userId=${user.id}`)
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []); // BUG SHF-04: Missing `user` dependency — effect never re-runs when user logs in

  if (!user) {
    return (
      <main className="order-history-page">
        <h1>My Orders</h1>
        <p>Please sign in to view your orders.</p>
      </main>
    );
  }

  return (
    <main className="order-history-page">
      <h1>My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order-list__item">
            <div className="order-list__id">Order #{order.id}</div>
            <div className="order-list__status">{order.status}</div>
            <div className="order-list__total">${order.total.toFixed(2)}</div>
            <div className="order-list__date">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

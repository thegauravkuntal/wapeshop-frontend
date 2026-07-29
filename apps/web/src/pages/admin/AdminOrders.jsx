import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const statusStyles = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  shipped: 'bg-purple-500/10 text-purple-400',
  delivered: 'bg-emerald-500/10 text-emerald-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('vape-shop-token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { headers });
      if (res.ok) { const d = await res.json(); setOrders(d || []); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT', headers, body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-white mb-6">Orders ({orders.length})</h1>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {order.user?.name} ({order.user?.email}) | {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="h-8 px-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  >
                    {statusOptions.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{item.title} × {item.quantity}</span>
                    <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total: <span className="text-white font-bold">₹{order.totalAmount}</span></span>
                {order.shippingAddress?.street && (
                  <span className="text-gray-500 text-xs">
                    📍 {order.shippingAddress.street}, {order.shippingAddress.city}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

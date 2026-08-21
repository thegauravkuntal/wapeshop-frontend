import React, { useState, useEffect } from 'react';
import PageHelmet from '@/components/PageHelmet';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  confirmed: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  delivered: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('vape-shop-token');
        const res = await fetch(`${API_BASE}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <PageHelmet title="My Orders" />
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHelmet title="My Orders" />
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-display text-3xl font-extrabold text-white mb-8 flex items-center gap-3">
          <Package size={28} /> My Orders
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-4">No orders yet</p>
            <Link to="/store" className="inline-block rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500 px-8 py-3 font-semibold text-white text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div key={order._id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white text-sm font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
                      <StatusIcon size={12} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.title} × {item.quantity}</span>
                        <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-white font-bold">₹{order.totalAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default OrdersPage;

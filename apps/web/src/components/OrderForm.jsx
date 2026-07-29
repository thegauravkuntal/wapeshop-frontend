import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, MapPin, User, Phone, CreditCard } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const OrderForm = ({ onClose }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({ title: 'Please login first', description: 'Order place karne ke liye login zaroori hai.', variant: 'destructive' });
      return;
    }

    if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.pincode) {
      toast({ title: 'Fill all fields', description: 'Saari shipping details bhariye.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('vape-shop-token');

      const totalAmount = cartItems.reduce((total, item) => {
        const price = item.variant.sale_price_in_cents
          ? item.variant.sale_price_in_cents / 100
          : item.variant.price_in_cents
          ? item.variant.price_in_cents / 100
          : 0;
        return total + price * item.quantity;
      }, 0);

      const orderItems = cartItems.map(item => ({
        product: item.product.id,
        variantId: item.variant.id,
        title: `${item.product.title} - ${item.variant.title}`,
        image: item.product.image || '',
        price: item.variant.sale_price_in_cents
          ? item.variant.sale_price_in_cents / 100
          : item.variant.price_in_cents
          ? item.variant.price_in_cents / 100
          : 0,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            name: form.name,
            phone: form.phone,
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          totalAmount,
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Order failed');
      }

      clearCart();
      toast({ title: 'Order Placed!', description: 'Aapka order successfully place ho gaya.' });
      navigate('/success');
      if (onClose) onClose();
    } catch (err) {
      toast({ title: 'Order Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c0c14] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-display font-extrabold text-white">Place Order</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><User size={12} /> Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><Phone size={12} /> Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><MapPin size={12} /> Street Address</label>
            <input type="text" name="street" value={form.street} onChange={handleChange} required
              placeholder="House no, Street, Area"
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} required
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Pincode</label>
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><CreditCard size={12} /> Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50">
              <option value="cod" className="text-gray-900 bg-white">Cash on Delivery</option>
              <option value="upi" className="text-gray-900 bg-white">UPI</option>
              <option value="card" className="text-gray-900 bg-white">Card</option>
            </select>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center text-white mb-2">
              <span className="text-sm text-gray-400">Items ({cartItems.length})</span>
              <span className="font-bold">{getCartTotal()}</span>
            </div>
            <div className="text-xs text-gray-500">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between py-0.5">
                  <span>{item.product.title} × {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;

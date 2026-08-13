import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, User, Phone, Package, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { openWhatsAppOrder } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_URL || '';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const storedArray = localStorage.getItem('checkout-items');
    const storedSingle = localStorage.getItem('checkout-item');

    if (storedArray) {
      try {
        setItems(JSON.parse(storedArray));
      } catch { setItems([]); }
    } else if (storedSingle) {
      try {
        setItems([JSON.parse(storedSingle)]);
      } catch { setItems([]); }
    } else {
      navigate('/store');
      return;
    }

    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removeItem = (index) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        localStorage.removeItem('checkout-items');
        localStorage.removeItem('checkout-item');
        navigate('/store');
      }
      return next;
    });
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({ title: 'Login required', description: 'Order place karne ke liye login karo.', variant: 'destructive' });
      return;
    }

    if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.pincode) {
      toast({ title: 'Fill all fields', description: 'Saari shipping details bhariye.', variant: 'destructive' });
      return;
    }

    if (items.length === 0) {
      toast({ title: 'No items', description: 'Koi product select nahi hua.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('vape-shop-token');
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderItems = items.map(item => ({
        product: item.productId,
        variantId: item.variantId,
        title: `${item.productTitle} - ${item.variantTitle}`,
        image: item.productImage,
        price: item.price,
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
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Order failed');
      }

      localStorage.removeItem('checkout-items');
      localStorage.removeItem('checkout-item');
      openWhatsAppOrder('919983457020', {
        name: form.name,
        phone: form.phone,
        address: `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`,
        items: items.map(item => ({
          title: `${item.productTitle} - ${item.variantTitle}`,
          quantity: item.quantity,
          price: item.price,
        })),
        total: totalAmount,
      });
      toast({ title: 'Order Placed!', description: 'Aapka order successfully place ho gaya.' });
      navigate('/success');
    } catch (err) {
      toast({ title: 'Order Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-400 mb-4">No items selected for checkout.</p>
        <Link to="/store" className="text-emerald-400 hover:text-emerald-300 text-sm">Store pe jao</Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const backLink = items.length === 1 ? `/product/${items[0].productId}` : '/store';

  return (
    <>
      <Helmet>
        <title>Checkout — Vape Shop Mumbai</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <Link to={backLink} className="inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 className="text-2xl font-display font-extrabold text-white mb-6">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-6">
          <form onSubmit={handleBuyNow} className="md:col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-display font-bold text-white mb-2">Shipping Details</h2>

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

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : 'Buy Now'}
            </button>
          </form>

          <div className="md:col-span-2">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                <Package size={18} className="text-emerald-400" /> Order Summary ({items.length})
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.productImage} alt={item.productTitle} loading="lazy"
                      className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.productTitle}</p>
                      <p className="text-gray-500 text-xs truncate">{item.variantTitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-emerald-400 font-bold text-sm">₹{item.price.toLocaleString()} × {item.quantity}</p>
                        <button onClick={() => removeItem(i)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Items</span>
                  <span className="text-white">{items.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const emptyProduct = {
  title: '', subtitle: '', description: '', image: '', category: '', ribbonText: '',
  variants: [{ title: '', price: 0, salePrice: 0, inventory: 0 }],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('vape-shop-token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`, { headers }),
        fetch(`${API_BASE}/api/categories`, { headers }),
      ]);
      if (pRes.ok) { const d = await pRes.json(); setProducts(d.products || []); }
      if (cRes.ok) { const d = await cRes.json(); setCategories(d || []); }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const url = editing ? `${API_BASE}/api/products/${editing}` : `${API_BASE}/api/products`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setEditing(null);
      setForm(emptyProduct);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Ye product delete ho jayega. Confirm karo.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (product) => {
    setEditing(product._id);
    setForm({
      title: product.title, subtitle: product.subtitle || '', description: product.description || '',
      image: product.image || '', category: product.category?._id || '', ribbonText: product.ribbonText || '',
      variants: product.variants?.length ? product.variants.map(v => ({
        title: v.title, price: v.price, salePrice: v.salePrice || 0, inventory: v.inventory || 0,
      })) : [{ title: '', price: 0, salePrice: 0, inventory: 0 }],
    });
  };

  const addVariant = () => setForm(prev => ({ ...prev, variants: [...prev.variants, { title: '', price: 0, salePrice: 0, inventory: 0 }] }));
  const removeVariant = (i) => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));
  const updateVariant = (i, key, val) => setForm(prev => ({ ...prev, variants: prev.variants.map((v, idx) => idx === i ? { ...v, [key]: val } : v) }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-extrabold text-white">Products ({products.length})</h1>
        {!editing && (
          <button onClick={() => { setForm(emptyProduct); setEditing('new'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {editing && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{editing === 'new' ? 'New Product' : 'Edit Product'}</h2>
            <button onClick={() => { setEditing(null); setForm(emptyProduct); }} className="text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50">
              <option value="" className="text-gray-900 bg-white">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id} className="text-gray-900 bg-white">{c.title}</option>)}
            </select>
            <input placeholder="Ribbon Text" value={form.ribbonText} onChange={e => setForm({...form, ribbonText: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>

          <h3 className="text-sm font-semibold text-gray-300 mb-2">Variants</h3>
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
              <input placeholder="Variant name" value={v.title} onChange={e => updateVariant(i, 'title', e.target.value)}
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
              <input type="number" placeholder="Price" value={v.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
              <input type="number" placeholder="Sale Price" value={v.salePrice} onChange={e => updateVariant(i, 'salePrice', Number(e.target.value))}
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
              <input type="number" placeholder="Stock" value={v.inventory} onChange={e => updateVariant(i, 'inventory', Number(e.target.value))}
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
              {form.variants.length > 1 && (
                <button onClick={() => removeVariant(i)} className="h-9 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20">Remove</button>
              )}
            </div>
          ))}
          <button onClick={addVariant} className="text-xs text-emerald-400 hover:text-emerald-300 mt-1">+ Add Variant</button>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving || !form.title}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setForm(emptyProduct); }}
              className="px-5 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p._id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
              {p.image ? <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <span className="text-gray-600 text-xs">No img</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{p.title}</p>
              <p className="text-gray-500 text-xs truncate">{p.subtitle} | {p.category?.title || 'No category'}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-emerald-400 font-semibold text-sm">₹{p.variants?.[0]?.salePrice || p.variants?.[0]?.price || 0}</p>
              <p className="text-gray-500 text-xs">{p.variants?.length || 0} variants</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;

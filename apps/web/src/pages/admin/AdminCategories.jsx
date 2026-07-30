import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', image: '', description: '', order: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('vape-shop-token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`, { headers });
      if (res.ok) { const d = await res.json(); setCategories(d || []); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const isNew = editing === 'new';
      const url = isNew ? `${API_BASE}/api/categories` : `${API_BASE}/api/categories/${editing}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setEditing(null); setForm({ title: '', image: '', description: '', order: 0 }); fetchData();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Ye category delete ho jayegi. Confirm karo.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchData();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-extrabold text-white">Categories ({categories.length})</h1>
        {!editing && (
          <button onClick={() => { setForm({ title: '', image: '', description: '', order: 0 }); setEditing('new'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {editing && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{editing === 'new' ? 'New Category' : 'Edit Category'}</h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
            <input type="number" placeholder="Sort Order" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})}
              className="h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.title}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="px-5 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c._id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
              {c.image ? <img src={c.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <span className="text-gray-600 text-xs">#{c.order}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{c.title}</p>
              <p className="text-gray-500 text-xs truncate">{c.description || 'No description'}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(c._id); setForm({ title: c.title, image: c.image || '', description: c.description || '', order: c.order || 0 }); }}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;

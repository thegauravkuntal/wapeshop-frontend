import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, User } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('vape-shop-token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`, { headers });
      if (res.ok) { const d = await res.json(); setUsers(d || []); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Ye user delete ho jayega. Confirm karo.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/users/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchUsers();
      else { const d = await res.json(); setError(d.message); }
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-white mb-6">Users ({users.length})</h1>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {u.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-medium text-sm truncate">{u.name}</p>
                {u.role === 'admin' && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                    <Shield size={10} /> Admin
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs truncate">{u.email} | {u.phone || 'No phone'}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-gray-500 text-xs">
                Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            {u.role !== 'admin' && (
              <button onClick={() => handleDelete(u._id)}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Eye, MessageSquare, Mail, Phone, Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem('vape-shop-token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leads`, { headers });
      if (!res.ok) throw new Error('Failed');
      setLeads(await res.json());
    } catch {
      toast({ title: 'Error', description: 'Failed to load leads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/api/leads/${id}/status`, {
        method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await fetch(`${API_BASE}/api/leads/${id}`, { method: 'DELETE', headers });
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selected?._id === id) setSelected(null);
      toast({ title: 'Deleted' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const statusBadge = (status) => {
    const styles = {
      new: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
      read: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      replied: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white">Leads</h1>
          <p className="text-sm text-gray-400 mt-1">{leads.length} total • {newCount} new</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Leads', count: leads.length, color: 'from-sky-500 to-sky-600' },
          { label: 'New', count: newCount, color: 'from-fuchsia-500 to-fuchsia-600' },
          { label: 'Replied', count: leads.filter(l => l.status === 'replied').length, color: 'from-emerald-500 to-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl bg-gradient-to-br ${stat.color} p-4 text-white`}>
            <p className="text-[10px] uppercase font-bold opacity-80">{stat.label}</p>
            <p className="text-3xl font-extrabold mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No leads yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {leads.map((lead) => (
              <div key={lead._id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {lead.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setSelected(lead); if (lead.status === 'new') updateStatus(lead._id, 'read'); }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{lead.name}</span>
                    {statusBadge(lead.status)}
                    <span className="text-[10px] text-gray-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{lead.message}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setSelected(lead); if (lead.status === 'new') updateStatus(lead._id, 'read'); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors" title="View">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => deleteLead(lead._id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-extrabold text-white">Lead Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-lg">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                  {selected.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{selected.name}</p>
                  <div className="flex gap-2 mt-0.5">{statusBadge(selected.status)}</div>
                </div>
              </div>
              {selected.email && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail size={14} className="text-emerald-400" /> {selected.email}
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone size={14} className="text-emerald-400" /> {selected.phone}
                </div>
              )}
              {selected.subject && (
                <div className="text-sm">
                  <span className="text-gray-500">Subject: </span>
                  <span className="text-gray-300">{selected.subject}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} /> {selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-IN') : ''}
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {selected.status !== 'replied' && (
                <button onClick={() => updateStatus(selected._id, 'replied')}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                  Mark as Replied
                </button>
              )}
              <button onClick={() => deleteLead(selected._id)}
                className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/25 transition-colors">
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;

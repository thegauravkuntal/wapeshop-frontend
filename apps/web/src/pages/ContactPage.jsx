import React, { useState } from 'react';
import PageHelmet from '@/components/PageHelmet';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || '';

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send');
      }
      toast({ title: 'Message sent!', description: "Thanks for reaching out — we'll get back to you soon." });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm';

  return (
    <>
      <PageHelmet title="Contact" />
      <section className="max-w-[75rem] mx-auto px-6 py-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Get in <span className="neon-text">Touch</span></h1>
          <p className="mt-5 text-gray-300">Questions about a product or your order? Reach out — we're here to help.</p>
          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4"><MapPin className="text-emerald-400" /><span className="text-gray-300">1st road, Prof. Almeda Pk Rd, Mumbai, Maharashtra 400050</span></div>
            <div className="flex items-center gap-4"><Phone className="text-emerald-400" /><span className="text-gray-300">+91 9306361736</span></div>
            <div className="flex items-center gap-4"><Mail className="text-emerald-400" /><span className="text-gray-300">hello@vapeshopmumbai.in</span></div>
          </div>
        </div>
        <form onSubmit={submit} className="glass-card rounded-2xl p-8 space-y-4">
          <input className={input} placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={input} type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={input} type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className={input} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea className={input} rows={5} placeholder="Your message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
          </button>
        </form>
      </section>
    </>
  );
};

export default ContactPage;

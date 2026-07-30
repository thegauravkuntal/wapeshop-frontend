import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSeoSettings, saveSeoSettings, resetSeoSettings } from '@/lib/seo';

const AdminSeo = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(getSeoSettings());
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setForm(getSeoSettings());
  }, []);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    saveSeoSettings(form);
    window.dispatchEvent(new Event('seo-updated'));
    toast({ title: 'SEO settings saved!' });
  };

  const handleReset = () => {
    const defaults = resetSeoSettings();
    setForm(defaults);
    window.dispatchEvent(new Event('seo-updated'));
    toast({ title: 'Reset to defaults' });
  };

  const fields = [
    { key: 'title', label: 'Site Title', placeholder: 'Vape Shop Mumbai Andheri...', type: 'text' },
    { key: 'description', label: 'Meta Description', placeholder: 'Describe your website...', type: 'textarea' },
    { key: 'keywords', label: 'Meta Keywords', placeholder: 'vape, mumbai, elfbar...', type: 'text' },
    { key: 'ogImage', label: 'OG Image URL (Facebook/Twitter preview)', placeholder: 'https://...', type: 'text' },
    { key: 'favicon', label: 'Favicon URL', placeholder: 'https://...', type: 'text' },
  ];

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50';

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-1">
          <Globe size={22} className="text-emerald-400" />
          <h1 className="text-2xl font-display font-extrabold text-white">SEO Settings</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">Manage how your site appears in search engines & social shares</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
            {type === 'textarea' ? (
              <textarea
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                type="text"
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="h-10 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] flex items-center gap-2">
            <CheckCircle size={16} /> Save
          </button>
          <button onClick={handleReset} className="h-10 px-6 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
          <button onClick={() => setPreview(!preview)} className="h-10 px-6 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2">
            <Eye size={14} /> {preview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </motion.div>

      {preview && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Eye size={14} /> Google Search Preview
          </h3>
          <div className="bg-white rounded-lg p-4 space-y-1">
            <p className="text-[12px] text-green-700">{window.location.hostname}</p>
            <p className="text-[18px] text-blue-700 font-medium leading-tight hover:underline cursor-pointer">{form.title}</p>
            <p className="text-[14px] text-gray-600 leading-snug">{form.description}</p>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="text-xs text-gray-500 bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <p className="font-medium text-gray-400 mb-1">How it works:</p>
        <p>Ye settings website ke har page ke &lt;head&gt; section me meta tags add karengi. Isliye Google & social media (Facebook, Twitter) ko sahi title, description aur image dikhegi. Changes save karte hi apply ho jayenge.</p>
      </motion.div>
    </div>
  );
};

export default AdminSeo;

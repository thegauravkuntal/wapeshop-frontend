import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Tags, ShoppingCart, TrendingUp, Clock, CheckCircle, ArrowUpRight, Zap, Star, Activity, MessageSquare } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (end === 0 || end === undefined) return;
    let start = 0;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);
  return count;
};

const StatCard = ({ icon: Icon, label, value, suffix, color, gradient, delay }) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const displayCount = useCountUp(numericValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 blur-2xl" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}>
            <Icon size={22} className="text-white" />
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            <ArrowUpRight size={12} /> Live
          </span>
        </div>
        <p className="text-3xl font-display font-extrabold text-white mb-1">
          {typeof value === 'number' ? displayCount.toLocaleString() : value}
          {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
        </p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
};

const BarChart = ({ data, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-44 px-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-white">{d.value}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            className={`w-full rounded-t-lg min-h-[4px] bg-gradient-to-t ${d.gradient} shadow-lg`}
          />
          <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ segments, size = 140, strokeWidth = 14 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = pct * circumference;
          const dashOffset = accumulated;
          accumulated += dashLen;
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-dashOffset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${dashLen} ${circumference - dashLen}` }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-display font-extrabold text-white">{total}</p>
        <p className="text-[10px] text-gray-500">Total</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('vape-shop-token');
        const res = await fetch(`${API_BASE}/api/auth/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-fuchsia-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-32">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Activity size={32} className="text-red-400" />
        </div>
        <p className="text-gray-400 text-lg">Failed to load stats.</p>
        <p className="text-gray-600 text-sm mt-1">Backend chalu hai ya nahi?</p>
      </div>
    );
  }

  const orderData = [
    { label: 'Pending', value: stats.pendingOrders || 0, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Confirmed', value: Math.max(0, (stats.totalOrders || 0) - (stats.pendingOrders || 0) - (stats.deliveredOrders || 0)), gradient: 'from-sky-500 to-blue-500' },
    { label: 'Delivered', value: stats.deliveredOrders || 0, gradient: 'from-emerald-500 to-teal-500' },
  ];

  const statusSegments = [
    { value: stats.pendingOrders || 0, color: '#f59e0b' },
    { value: Math.max(0, (stats.totalOrders || 0) - (stats.pendingOrders || 0) - (stats.deliveredOrders || 0)), color: '#38bdf8' },
    { value: stats.deliveredOrders || 0, color: '#34d399' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-display font-extrabold text-white">
          Dashboard <span className="neon-text">Overview</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Real-time stats of your vape shop</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="from-sky-500 to-blue-600" gradient="from-sky-500 to-blue-600" delay={0} />
        <StatCard icon={Package} label="Products" value={stats.totalProducts} color="from-fuchsia-500 to-purple-600" gradient="from-fuchsia-500 to-purple-600" delay={0.1} />
        <StatCard icon={Tags} label="Categories" value={stats.totalCategories} color="from-emerald-500 to-teal-600" gradient="from-emerald-500 to-teal-600" delay={0.2} />
        <StatCard icon={TrendingUp} label="Revenue" value={stats.totalRevenue} suffix="₹" color="from-amber-500 to-orange-600" gradient="from-amber-500 to-orange-600" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <BarChart3 /> Orders Overview
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Order status breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Confirmed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Delivered</span>
            </div>
          </div>
          <BarChart data={orderData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <h2 className="text-lg font-display font-bold text-white mb-4 self-start flex items-center gap-2">
            <Activity size={18} className="text-fuchsia-400" /> Order Status
          </h2>
          <DonutChart segments={statusSegments} />
          <div className="flex gap-4 mt-4 text-xs">
            <div className="text-center">
              <p className="text-amber-400 font-bold text-lg">{stats.pendingOrders || 0}</p>
              <p className="text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-sky-400 font-bold text-lg">{Math.max(0, (stats.totalOrders || 0) - (stats.pendingOrders || 0) - (stats.deliveredOrders || 0))}</p>
              <p className="text-gray-500">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-bold text-lg">{stats.deliveredOrders || 0}</p>
              <p className="text-gray-500">Delivered</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: 'from-sky-500 to-blue-600', glow: 'shadow-sky-500/20' },
          { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
          { icon: CheckCircle, label: 'Delivered', value: stats.deliveredOrders, color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
          { icon: MessageSquare, label: 'Leads', value: stats.totalLeads || 0, color: 'from-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/20' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-lg ${item.glow}`}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
              <item.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-display font-extrabold text-white">{item.value}</p>
              <p className="text-sm text-gray-400">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-purple-600/10 border border-white/10 p-6"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Star size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">Quick Summary</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {stats.totalProducts} products in {stats.totalCategories} categories.{' '}
              {stats.totalOrders} orders placed, {stats.deliveredOrders} delivered.{' '}
              {stats.totalLeads || 0} leads received.
              {stats.totalRevenue > 0 && ` Revenue: ₹${stats.totalRevenue.toLocaleString()}.`}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BarChart3 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400">
    <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

export default AdminDashboard;

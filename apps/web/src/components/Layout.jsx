import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, ShoppingBag, User, Menu, X, Flame, Mail, Lock, UserPlus, Eye, EyeOff, LogOut, Package, UserCircle, LayoutDashboard, LogIn } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth, OPEN_AUTH_EVENT } from '@/context/AuthContext';
import { getSeoSettings } from '@/lib/seo';
import ShoppingCart from '@/components/ShoppingCart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO = 'https://horizons-cdn.hostinger.com/e2f1ece2-d7c0-4f82-9306-ebd3eb0d039c/94114334774e476ae574972944e6913d.jpg';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/store', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Header = ({ onCartClick, onAuthOpen }) => {
  const { cartItems } = useCart();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const count = cartItems.reduce((n, i) => n + i.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center text-sm font-semibold py-2 px-4 flex items-center justify-center gap-2">
        <Flame size={15} className="shrink-0" />
        <span>Flat 20% OFF on all Disposable Vapes — Use Code: <span className="font-bold tracking-wide">VAPE20</span></span>
      </div>
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={LOGO} alt="Store logo" fetchPriority="high" className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/15" />
            <span className="leading-tight">
              <span className="block font-display font-extrabold text-lg tracking-wide">VAPE SHOP</span>
              <span className="block text-[10px] font-semibold tracking-[0.25em] text-emerald-400">MUMBAI ANDHERI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative ${isActive ? 'text-emerald-400' : 'text-gray-200 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative flex items-center gap-3 sm:gap-5">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-200 hover:text-emerald-400 transition-colors" aria-label="Search"><Search size={20} /></button>
            <button onClick={onCartClick} className="relative text-gray-200 hover:text-emerald-400 transition-colors" aria-label="Cart">
              <ShoppingBag size={21} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">{count}</span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-200 hover:text-emerald-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0c0c14] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <UserCircle size={16} /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => onAuthOpen('login')} className="hidden sm:block text-gray-200 hover:text-emerald-400 transition-colors" aria-label="Account"><User size={20} /></button>
            )}

            <button className="md:hidden text-gray-200" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && !isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden md:block border-t border-white/10 bg-black/95 px-4 sm:px-6"
            >
              <form onSubmit={handleSearch} className="max-w-[90rem] mx-auto py-3 flex items-center gap-2">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 h-10 bg-white/5 border border-white/15 rounded-lg px-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-white transition-colors p-1">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
          {searchOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-black/95 px-4"
            >
              <form onSubmit={handleSearch} className="py-3 flex items-center gap-2">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 h-10 bg-white/5 border border-white/15 rounded-lg px-3 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-white transition-colors p-1">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[280px] bg-[#0a0a12] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="text-white font-display font-bold text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-5 space-y-1">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center h-11 px-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>

              <div className="border-t border-white/10 p-5">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-amber-400 hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <UserCircle size={16} /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <button onClick={() => { setMobileOpen(false); logout(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-xs text-center">Account</p>
                    <button onClick={() => { setMobileOpen(false); onAuthOpen('login'); }}
                      className="w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn size={16} /> Login
                    </button>
                    <button onClick={() => { setMobileOpen(false); onAuthOpen('signup'); }}
                      className="w-full h-11 rounded-lg bg-white/5 border border-white/10 font-semibold text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} /> Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 bg-black mt-24">
    <div className="max-w-[90rem] mx-auto px-6 py-14 grid gap-10 md:grid-cols-5">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={LOGO} alt="logo" className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold">VAPE SHOP</span>
        </div>
        <p className="text-sm text-gray-400">Premium vapes, pods and e-liquids delivered across Mumbai. Andheri's most loved vape store.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">Shop</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          {['ELFBAR VAPES','ELFBAR RAYA','ALFAKHER CROWN BAR','GEEK VAPES','TEREA & HEETS','DISPOSABLE VAPES','MORE ITEMS'].map((c) => (
            <li key={c}><Link to="/store" className="hover:text-emerald-400">{c}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">Categories</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          {['ELFBAR MOONLIGHT','I GET VAPES','YUOTO VAPES','PEN VAPES','RECHARGEABLE VAPES','DTY HERB & CHARGER'].map((c) => (
            <li key={c}><Link to="/store" className="hover:text-emerald-400">{c}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">Company</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
          <li><Link to="/store" className="hover:text-emerald-400">All Products</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4 text-white">Get in touch</h4>
        <p className="text-sm text-gray-400">1st road, Prof. Almeda Pk Rd, Mumbai, Maharashtra 400050</p>
        <p className="text-sm text-gray-400 mt-2">Free delivery across Mumbai on orders above ₹999</p>
      </div>
    </div>
    <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} vapeshopbandramumbai24. Age 18+ only. All rights reserved.
    </div>
  </footer>
);

const AuthDialog = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setLoginEmail('');
      setLoginPass('');
      setSignupName('');
      setSignupEmail('');
      setSignupPass('');
      setSignupConfirm('');
      setSignupPhone('');
      setShowPass(false);
    }
  }, [isOpen, initialMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (signupPass !== signupConfirm) {
      setError('Passwords do not match');
      return;
    }
    if (signupPass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ name: signupName, email: signupEmail, password: signupPass, phone: signupPhone });
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0c0c14] border-white/10 text-white p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
          <div className="relative p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-display text-xl font-bold text-white">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </DialogTitle>
            </DialogHeader>

            <div className="flex bg-white/5 rounded-lg p-1 mb-6">
              <button onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'login' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                Login
              </button>
              <button onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email address" required
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPass ? 'text' : 'password'} value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Password" required
                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                  <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Full name" required
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email address" required
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPass ? 'text' : 'password'} value={signupPass} onChange={(e) => setSignupPass(e.target.value)}
                    placeholder="Password (min 6 characters)" required minLength={6}
                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)}
                    placeholder="Confirm password" required minLength={6}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="tel" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="Phone number (optional)"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-gray-500">
              {mode === 'login' ? (
                <span>New here? <button onClick={() => { setMode('signup'); setError(''); }} className="text-emerald-400 hover:text-emerald-300 font-semibold">Create an account</button></span>
              ) : (
                <span>Already have an account? <button onClick={() => { setMode('login'); setError(''); }} className="text-emerald-400 hover:text-emerald-300 font-semibold">Login instead</button></span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [seo, setSeo] = useState(getSeoSettings());

  useEffect(() => {
    const handleOpenAuth = (e) => {
      setAuthMode(e.detail?.mode || 'login');
      setIsAuthOpen(true);
    };
    window.addEventListener(OPEN_AUTH_EVENT, handleOpenAuth);

    const handleStorageChange = () => setSeo(getSeoSettings());
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('seo-updated', handleStorageChange);

    return () => {
      window.removeEventListener(OPEN_AUTH_EVENT, handleOpenAuth);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('seo-updated', handleStorageChange);
    };
  }, []);

  const handleAuthOpen = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050507]">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.ogImage} />
        <link rel="icon" href={seo.favicon} />
      </Helmet>
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthOpen={handleAuthOpen}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, Star, Zap, RotateCcw, Heart, Award, Quote, Sparkles, Tag } from 'lucide-react';
import ProductsList from '@/components/ProductsList';

const API_BASE = import.meta.env.VITE_API_URL || '';

const HeroImg = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-sky-500/10 animate-pulse rounded-2xl" />}
      <img
        src={src}
        alt={alt}
        width={300}
        height={400}
        loading="eager"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </>
  );
};

const CatImg = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 bg-white/5 animate-pulse rounded-xl" />}
      <img
        src={src}
        alt={alt}
        width={80}
        height={80}
        loading="eager"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </>
  );
};

const catPlaceholder = 'https://images.hostinger.com/d27fd603-ff66-40e3-9da8-38e6b8e4ae48.png';

const HomePage = () => {
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.ok ? res.json() : [])
      .then(setDbCategories)
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Vape Shop Mumbai Andheri — Premium Vapes & E-Liquids</title>
        <meta name="description" content="vapeshopbandramumbai24 — premium disposable vapes, pods, e-liquids and CBD vapes delivered across Mumbai." />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.25),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(56,189,248,0.2),transparent_55%)]" />
        <div className="relative max-w-[90rem] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 mb-6">
              <Star size={13} className="fill-emerald-400" /> Andheri's #1 Vape Store
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              Elevate Your <br /> <span className="neon-text">Vape Experience</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-md">
              Explore a premium range of disposable vapes, pod systems, e-liquids and more — with colorful clouds and unbeatable flavor.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/store" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:brightness-110 transition-all active:scale-[0.98]">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white hover:bg-white/5 transition-all">
                Learn More
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-2"><Truck size={17} className="text-emerald-400" /> Free Mumbai delivery ₹999+</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-400" /> 100% Authentic</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center items-center h-[520px] perspective-[1200px]">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-sky-500/20 via-fuchsia-500/20 to-purple-600/20 rounded-full" />
            <div className="relative w-[300px] h-[400px] animate-carousel" style={{ transformStyle: 'preserve-3d' }}>
              {[
                { img: 'https://images.hostinger.com/d27fd603-ff66-40e3-9da8-38e6b8e4ae48.png' },
                { img: 'https://images.hostinger.com/5eab9da6-8d68-46ca-b65c-9724b3c26193.png' },
                { img: 'https://images.hostinger.com/96db0cdd-77a1-4403-ac60-0cf1cff497ad.png' },
                { img: 'https://images.hostinger.com/019cf443-90fa-4626-94fa-78805cafdf52.png' },
                { img: 'https://images.hostinger.com/548e8e8b-a0ba-4c1b-8755-b64130e4d70e.png' },
                { img: 'https://images.hostinger.com/14c3995f-cde9-49e0-b1a0-fc7e5d366db8.png' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-fuchsia-500/20"
                  style={{
                    transform: `rotateY(${i * 60}deg) translateZ(280px)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <HeroImg src={item.img} alt="Vape product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Shop by <span className="neon-text">Category</span></h2>
          <p className="text-gray-400 mt-3">Explore our wide range of premium vape categories</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {(dbCategories.length > 0 ? dbCategories : (() => { const d = []; for (let i = 0; i < 5; i++) d.push({ _id: 'skeleton', title: '', image: '' }); return d; })()).map((c, i) => (
            <motion.div key={c._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link
                to={c._id && c._id !== 'skeleton' ? `/store?category=${c._id}` : '/store'}
                className="group block rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_45px_-8px_rgba(56,189,248,0.6)]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <CatImg src={c.image || catPlaceholder} alt={c.title || c.name || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display font-bold text-sm sm:text-base leading-tight">{c.title || '...'}</h3>
                    <p className="text-[11px] text-gray-300 mt-0.5">{(c.title || '').substring(0, 24)}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Why <span className="neon-text">Choose Us</span></h2>
          <p className="text-gray-400 mt-3">We don't just sell vapes — we deliver an experience</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShieldCheck, title: '100% Authentic', desc: 'Every product sourced directly from verified brands. Zero fakes, zero compromise.', color: 'from-emerald-400 to-teal-500' },
            { icon: Truck, title: 'Same Day Delivery', desc: 'Order before 6 PM and get it delivered the same day across Mumbai.', color: 'from-sky-400 to-blue-500' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Quick checkout, instant order confirmation, and real-time tracking on every order.', color: 'from-amber-400 to-orange-500' },
            { icon: RotateCcw, title: 'Easy Returns', desc: 'Not satisfied? Return unopened products within 7 days. No questions asked.', color: 'from-fuchsia-400 to-pink-500' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }} className="glass-card rounded-2xl p-7 text-center group hover:-translate-y-1.5 transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={26} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMBO DEALS */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-sky-900/20" />
        <div className="relative max-w-[90rem] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-fuchsia-300 mb-4">
              <Tag size={13} /> Limited Time Offers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Combo <span className="neon-text">Deals</span></h2>
            <p className="text-gray-400 mt-3">Save big when you bundle up — exclusive combo packs</p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Starter Pack', items: '2x Disposable + 1x Pod System', original: '₹2,499', deal: '₹1,899', save: 'Save ₹600', glow: 'shadow-sky-500/20', img: 'https://images.hostinger.com/d27fd603-ff66-40e3-9da8-38e6b8e4ae48.png', tag: 'Best Seller' },
              { name: 'Flavor Explorer', items: '3x E-Liquids + 1x Coil Pack', original: '₹1,799', deal: '₹1,299', save: 'Save ₹500', glow: 'shadow-fuchsia-500/20', img: 'https://images.hostinger.com/96db0cdd-77a1-4403-ac60-0cf1cff497ad.png', tag: 'Trending' },
              { name: 'VIP Bundle', items: 'Full Kit + 5x E-Liquids + Accessories', original: '₹5,999', deal: '₹4,299', save: 'Save ₹1,700', glow: 'shadow-purple-500/20', img: 'https://images.hostinger.com/019cf443-90fa-4626-94fa-78805cafdf52.png', tag: 'Best Value' },
            ].map((combo, i) => (
              <motion.div key={combo.name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }} className={`glass-card rounded-2xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 shadow-lg ${combo.glow}`}>
                <div className="relative h-52 overflow-hidden">
                  <CatImg src={combo.img} alt={combo.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-1 text-[11px] font-bold text-white">{combo.tag}</span>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-emerald-400 font-bold text-xl">{combo.deal}</span>
                    <span className="ml-2 text-gray-400 line-through text-sm">{combo.original}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg mb-1">{combo.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{combo.items}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-full px-3 py-1">{combo.save}</span>
                    <Link to="/store" className="inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                      Grab Deal <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-300 mb-5">
              <Heart size={13} className="fill-emerald-300" /> Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-6">
              Born in <span className="neon-text">Mumbai</span>,<br />Built for Flavor
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                What started as a small shop in Andheri West has grown into Mumbai's most trusted destination for premium vapes and e-liquids. We saw a gap in the market for authentic, high-quality products — and we filled it.
              </p>
              <p>
                Every product on our shelves is handpicked, lab-tested, and sourced directly from leading brands worldwide. We believe everyone deserves access to the finest vaping experience without worrying about counterfeits.
              </p>
              <p>
                Today, we serve thousands of happy customers across Mumbai with same-day delivery, unbeatable prices, and a team that actually cares about your experience.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-8">
              {[
                { num: '10,000+', label: 'Happy Customers' },
                { num: '500+', label: 'Products' },
                { num: '4.9', label: 'Star Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block font-display font-extrabold text-2xl neon-text">{stat.num}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-emerald-500/25 via-fuchsia-500/20 to-purple-600/25 rounded-full" />
            <div className="relative glass-card rounded-2xl p-8 sm:p-10">
              <Award size={40} className="text-emerald-400 mb-5" />
              <h3 className="font-display font-bold text-xl mb-3">Our Promise</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3"><Sparkles size={16} className="text-emerald-400 mt-0.5 shrink-0" /> Only genuine, lab-tested products from authorized distributors</li>
                <li className="flex items-start gap-3"><Sparkles size={16} className="text-sky-400 mt-0.5 shrink-0" /> Expert guidance to help you find the perfect setup for your needs</li>
                <li className="flex items-start gap-3"><Sparkles size={16} className="text-fuchsia-400 mt-0.5 shrink-0" /> Hassle-free returns and dedicated customer support</li>
                <li className="flex items-start gap-3"><Sparkles size={16} className="text-purple-400 mt-0.5 shrink-0" /> Same-day delivery across all of Mumbai — fast and reliable</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOST LOVED */}
      <section className="max-w-[90rem] mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Most Loved <span className="neon-text">Products</span></h2>
          <Link to="/store" className="hidden sm:inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
        <ProductsList />
        <div className="mt-10 text-center sm:hidden">
          <Link to="/store" className="inline-flex items-center gap-2 text-emerald-400 font-semibold">View All Products <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold">What Our <span className="neon-text">Customers</span> Say</h2>
          <p className="text-gray-400 mt-3">Don't just take our word for it — hear from the community</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: 'Rohan M.', location: 'Andheri West', text: 'Best vape shop in Mumbai, hands down. The product quality is unmatched and the same-day delivery is a lifesaver. I\'ve been ordering for 6 months now.', stars: 5, avatar: 'R' },
            { name: 'Priya S.', location: 'Bandra', text: 'Finally a shop I can trust! Every product is authentic and the team helped me pick the perfect pod system. The combo deals are insane value.', stars: 5, avatar: 'P' },
            { name: 'Aditya K.', location: 'Juhu', text: 'The Flavor Explorer combo was my first order and I was blown away. Great prices, genuine products, and the delivery guy was super professional.', stars: 5, avatar: 'A' },
          ].map((review, i) => (
            <motion.div key={review.name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }} className="glass-card rounded-2xl p-6 flex flex-col group hover:-translate-y-1.5 transition-all duration-300">
              <Quote size={28} className="text-fuchsia-500/40 mb-3" />
              <p className="text-sm text-gray-300 leading-relaxed flex-grow">"{review.text}"</p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center font-display font-bold text-sm text-white">
                  {review.avatar}
                </div>
                <div className="flex-grow">
                  <span className="block font-semibold text-sm">{review.name}</span>
                  <span className="text-xs text-gray-500">{review.location}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.stars }).map((_, si) => (
                    <Star key={si} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[90rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-fuchsia-500 to-purple-600 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Ready to Elevate Your Vape Game?</h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8">Join 10,000+ happy customers across Mumbai. Order now and get free delivery on orders above ₹999.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/store" className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-8 py-3.5 font-bold shadow-lg hover:bg-gray-100 transition-all active:scale-[0.98]">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;

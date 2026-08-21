import React, { useState, useEffect } from 'react';
import PageHelmet from '@/components/PageHelmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';

const API_BASE = import.meta.env.VITE_API_URL || '';

const StorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.ok ? res.json() : [])
      .then(setCategories)
      .catch(() => {});
  }, []);

  const setCategory = (id) => {
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <PageHelmet title="All Products" />
      <section className="max-w-[90rem] mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Our <span className="neon-text">Products</span></h1>
          <p className="text-gray-400 mt-3">Premium disposable vapes, pods, e-liquids and more</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                !activeCategory
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                onClick={() => setCategory(c._id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === c._id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        <ProductsList categoryId={activeCategory} />
      </section>
    </>
  );
};

export default StorePage;
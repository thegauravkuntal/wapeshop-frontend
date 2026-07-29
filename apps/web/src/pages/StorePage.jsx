import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';

const StorePage = () => (
  <>
    <Helmet><title>All Products — Vape Shop Mumbai Andheri</title></Helmet>
    <section className="max-w-[90rem] mx-auto px-6 py-14">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Our <span className="neon-text">Products</span></h1>
        <p className="text-gray-400 mt-3">Premium disposable vapes, pods, e-liquids and more</p>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
      </div>
      <ProductsList />
    </section>
  </>
);

export default StorePage;

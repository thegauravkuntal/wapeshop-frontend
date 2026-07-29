import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Truck, Award, Heart } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: '100% Authentic', text: 'Every product is sourced directly from trusted brands.' },
  { icon: Truck, title: 'Fast Mumbai Delivery', text: 'Free delivery across Mumbai on orders above ₹999.' },
  { icon: Award, title: 'Premium Selection', text: 'Handpicked disposables, pods, kits and e-liquids.' },
  { icon: Heart, title: 'Loved Locally', text: "Andheri's most trusted vape store since day one." },
];

const AboutPage = () => (
  <>
    <Helmet><title>About — Vape Shop Mumbai Andheri</title></Helmet>
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold">About <span className="neon-text">Vape Shop</span></h1>
      <p className="mt-6 text-lg text-gray-300">
        vapeshopbandramumbai24 is Andheri's premium destination for disposable vapes, pod systems, e-liquids,
        vape kits, accessories and CBD vapes. We bring authentic products, bold flavors and colorful clouds to
        vapers across Mumbai — with fast delivery and expert support.
      </p>
    </section>
    <section className="max-w-[80rem] mx-auto px-6 pb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div key={f.title} className="glass-card rounded-2xl p-7 text-center">
          <f.icon className="mx-auto mb-4 text-emerald-400" size={34} />
          <h3 className="font-display font-bold text-lg">{f.title}</h3>
          <p className="text-sm text-gray-400 mt-2">{f.text}</p>
        </div>
      ))}
    </section>
  </>
);

export default AboutPage;

import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const posts = [
  {
    title: 'Best Disposable Vapes in Mumbai — 2026 Buying Guide',
    excerpt: 'ELFBAR, Yuoto, I GET or Geek Vapes? We compare the top disposable vapes available in Mumbai so you can pick the perfect puff bar.',
    tag: 'Buying Guide',
  },
  {
    title: 'Vaporesso Pod Systems: Which One Is Right for You?',
    excerpt: 'From beginner-friendly pods to advanced mods, learn which Vaporesso device suits your vaping style. Available online in Mumbai with same day delivery.',
    tag: 'Devices',
  },
  {
    title: 'How Same Day Vape Delivery Works in Bandra & Andheri',
    excerpt: 'Order before 6 PM, get your vape the same evening. Here is exactly how our same day vape delivery across Mumbai operates.',
    tag: 'Delivery',
  },
  {
    title: 'How to Spot Fake vs Authentic Vape Products',
    excerpt: 'Counterfeit vapes exist. Follow this checklist to make sure the product you buy — online or offline — is 100% genuine.',
    tag: 'Safety',
  },
];

const BlogPage = () => (
  <>
    <PageHelmet rawTitle="Vape Shop Mumbai Blog | Guides on Disposable Vapes, Pods & E-Liquids" />
    <section className="max-w-[75rem] mx-auto px-6 py-20">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Vape Shop <span className="neon-text">Mumbai Blog</span></h1>
      <p className="mt-4 text-gray-300 max-w-2xl">
        Guides, tips and product roundups from Vape Shop Mumbai Bandra — Mumbai's trusted online vape store for disposable vapes, pod systems and e-liquids.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <article key={p.title} className="glass-card rounded-2xl p-7 hover:-translate-y-1.5 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 rounded-full px-3 py-1">{p.tag}</span>
            </div>
            <h2 className="font-display text-xl font-bold leading-snug">{p.title}</h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">{p.excerpt}</p>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
              Read More <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default BlogPage;

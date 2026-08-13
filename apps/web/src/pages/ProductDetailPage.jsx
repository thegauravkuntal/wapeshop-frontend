import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Minus, Plus, XCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, OPEN_AUTH_EVENT } from '@/context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';
const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleCheckout = () => {
    if (!product || !selectedVariant) return;

    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent(OPEN_AUTH_EVENT, { detail: { mode: 'login' } }));
      return;
    }

    if (selectedVariant.inventory !== undefined && selectedVariant.inventory <= 0) {
      toast({ title: 'Out of stock', description: 'Yeh product abhi available nahi hai.', variant: 'destructive' });
      return;
    }

    const checkoutData = {
      productId: product._id,
      productTitle: product.title,
      productImage: product.image || product.images?.[0]?.url || placeholderImage,
      variantId: selectedVariant._id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.salePrice || selectedVariant.price,
      originalPrice: selectedVariant.price,
      quantity: quantity,
      stock: selectedVariant.inventory || 99,
    };

    localStorage.setItem('checkout-items', JSON.stringify([checkoutData]));
    localStorage.removeItem('checkout-item');
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link to="/store" className="inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <div className="text-center text-red-400 p-8 bg-white/[0.03] border border-white/10 rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-4">{error || 'Product not found'}</p>
          <Link to="/store" className="text-emerald-400 hover:text-emerald-300 text-sm">Store pe jao</Link>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.salePrice || selectedVariant?.price || 0;
  const originalPrice = selectedVariant?.price || 0;
  const stock = selectedVariant?.inventory || 0;

  return (
    <>
      <Helmet>
        <title>{product.title} — Vape Shop Mumbai</title>
      </Helmet>
      <div className="max-w-5xl mx-auto">
        <Link to="/store" className="inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative overflow-hidden rounded-xl bg-white/5">
              <img
                src={product.image || product.images?.[0]?.url || placeholderImage}
                alt={product.title}
                fetchPriority="high"
                onError={(e) => { e.currentTarget.src = placeholderImage; }}
                className="w-full h-80 md:h-[420px] object-cover"
              />
              {product.ribbonText && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.ribbonText}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-1">{product.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{product.subtitle || product.category?.title || ''}</p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-emerald-400">₹{price.toLocaleString()}</span>
              {originalPrice > price && (
                <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
            )}

            {product.variants?.length > 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Variant:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedVariant?._id === v._id
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {v.title} — ₹{(v.salePrice || v.price).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Quantity:</p>
              <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-white font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {stock > 0 ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1 mb-4">
                <CheckCircle size={12} /> {stock} in stock
              </p>
            ) : (
              <p className="text-xs text-red-400 flex items-center gap-1 mb-4">
                <XCircle size={12} /> Out of stock
              </p>
            )}

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-xl font-bold text-white">₹{(price * quantity).toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={stock <= 0}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} /> Checkout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;

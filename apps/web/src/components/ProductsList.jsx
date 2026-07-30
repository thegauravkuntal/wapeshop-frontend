import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useAuth, OPEN_AUTH_EVENT } from '@/context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const variant = product.variants?.[0];
  const variantId = variant?._id || variant?.title;
  const isInCart = cartItems.some(item => item.variant.id === variantId);

  const price = product.variants?.[0]?.salePrice || product.variants?.[0]?.price || 0;
  const originalPrice = product.variants?.[0]?.price || 0;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleToggleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) {
      toast({ title: "No variant available", variant: "destructive" });
      return;
    }

    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent(OPEN_AUTH_EVENT, { detail: { mode: 'login' } }));
      return;
    }

    if (isInCart) {
      removeFromCart(variantId);
      toast({ title: "Removed from Cart", description: `${product.title} hata diya cart se.` });
      return;
    }

    const mockProduct = {
      id: product._id,
      title: product.title,
      image: product.image || product.images?.[0]?.url || placeholderImage,
    };
    const mockVariant = {
      id: variant._id || variant.title,
      title: variant.title,
      price_in_cents: variant.price * 100,
      sale_price_in_cents: (variant.salePrice || variant.price) * 100,
      price_formatted: `₹${variant.price}`,
      sale_price_formatted: `₹${variant.salePrice || variant.price}`,
      currency_info: { code: 'INR', symbol: '₹', decimal_digits: 0 },
      manage_inventory: true,
      inventory_quantity: variant.inventory || 99,
    };
    try {
      setAdding(true);
      await addToCart(mockProduct, mockVariant, 1, variant.inventory || 99);
      toast({ title: "Added to Cart!", description: `${product.title} added to cart.` });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/10 hover:-translate-y-1.5">
        <Link to={`/product/${product._id}`}>
          <div className="relative overflow-hidden bg-white/5">
            {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-white/5 rounded-2xl" />}
            <img
              src={product.image || product.images?.[0]?.url || placeholderImage}
              alt={product.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {product.ribbonText && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{product.ribbonText}</span>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">-{discount}%</span>
            )}
          </div>
        </Link>
        <div className="p-4">
          <h3 className="font-display font-bold text-base truncate">{product.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{product.subtitle || product.category?.title || ''}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-400 font-extrabold text-lg">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-gray-500 line-through text-sm">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleToggleCart}
              disabled={adding}
              className={`flex-1 flex items-center justify-center gap-2 h-9 font-semibold text-sm rounded-lg transition-all disabled:opacity-50 ${
                isInCart
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white'
              }`}
            >
              <ShoppingCart size={14} /> {adding ? '...' : isInCart ? 'Remove' : 'Add to Cart'}
            </button>
            <Link
              to={`/product/${product._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors"
            >
              <Eye size={14} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
        const res = await fetch(`${API_BASE}/api/products${params}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No products found.</p>
        <p className="text-sm mt-2">Backend se products load ho rahe hain. Seed chalao: <code className="text-emerald-400">npm run seed</code></p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;

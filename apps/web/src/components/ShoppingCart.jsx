import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      toast({ title: 'Cart is empty', description: 'Pehle kuch products add karo.', variant: 'destructive' });
      return;
    }
    if (!isAuthenticated) {
      toast({ title: 'Login required', description: 'Order place karne ke liye login karo.', variant: 'destructive' });
      return;
    }

    const checkoutItems = cartItems.map(item => ({
      productId: item.product.id,
      productTitle: item.product.title,
      productImage: item.product.image || 'https://via.placeholder.com/80',
      variantId: item.variant.id,
      variantTitle: item.variant.title,
      price: item.variant.sale_price_in_cents
        ? item.variant.sale_price_in_cents / 100
        : item.variant.price_in_cents
        ? item.variant.price_in_cents / 100
        : 0,
      originalPrice: item.variant.price_in_cents
        ? item.variant.price_in_cents / 100
        : 0,
      quantity: item.quantity,
      stock: item.variant.inventory_quantity || 99,
    }));

    localStorage.setItem('checkout-items', JSON.stringify(checkoutItems));
    localStorage.removeItem('checkout-item');
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const slideVariants = isMobile
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
      };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={slideVariants.initial}
            animate={slideVariants.animate}
            exit={slideVariants.exit}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={
              isMobile
                ? 'absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#0a0a12] border-t border-white/10 rounded-t-2xl shadow-2xl flex flex-col'
                : 'absolute right-0 top-0 h-full w-full max-w-md bg-[#0a0a12] border-l border-white/10 shadow-2xl flex flex-col'
            }
          >
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-400" />
                Cart ({cartItems.length})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-5' : 'px-5'} space-y-3`}>
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCartIcon size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Cart is empty</p>
                  <p className="text-gray-600 text-sm mt-1">Products add karo cart mein</p>
                </div>
              ) : (
                cartItems.map(item => {
                  const price = item.variant.sale_price_in_cents
                    ? item.variant.sale_price_in_cents / 100
                    : item.variant.price_in_cents
                    ? item.variant.price_in_cents / 100
                    : 0;

                  return (
                    <div key={item.variant.id} className="flex gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/80'}
                        alt={item.product.title}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80'; }}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-gray-500 text-xs truncate">{item.variant.title}</p>
                        <p className="text-emerald-400 font-bold text-sm mt-1">₹{price.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button onClick={() => removeFromCart(item.variant.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-white text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className={`${isMobile ? 'px-5 pb-8 pt-3' : 'p-5'} border-t border-white/10 space-y-3 shrink-0`}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-xl font-bold text-white">{getCartTotal()}</span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-sm text-white hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Buy Now
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;

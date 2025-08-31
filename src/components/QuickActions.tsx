import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Cart from './Cart';
import { useApp } from '../context/AppContext';

export default function QuickActions() {
  const { state } = useApp();
  const [showCart, setShowCart] = useState(false);
  const cartItemCount = Array.isArray(state.cart)
    ? state.cart.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
      </button>

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={onCheckout}
      />
    </>
  );
}
'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useBookingCart } from './BookingCartProvider';

export default function FloatingBookingCart() {
  const { cartCount, cartGrandTotal, openDrawer } = useBookingCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 animate-bounce">
      <button
        onClick={openDrawer}
        className="flex items-center gap-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-obsidian-950 px-4 py-3 rounded-full shadow-2xl hover:shadow-gold-500/50 border border-gold-300 font-bold transition-transform hover:scale-105 active:scale-95"
        aria-label="فتح حافظة الحجز"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-obsidian-900 text-gold-300 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
            {cartCount}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs font-black">حافظة الحجز</div>
          {cartGrandTotal > 0 && (
            <div className="text-[10px] text-obsidian-900 font-mono font-semibold">
              {cartGrandTotal.toLocaleString('ar-YE')} ر.ي
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

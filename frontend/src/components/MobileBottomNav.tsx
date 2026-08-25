'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, MessageCircle, ShoppingBag } from 'lucide-react';
import { useBookingCart } from './BookingCartProvider';
import { trackEvent } from '../lib/analytics';

interface MobileBottomNavProps {
  phone?: string;
  whatsapp?: string;
}

export default function MobileBottomNav({
  phone = '773046703',
  whatsapp = '773046703',
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { cartCount, openDrawer } = useBookingCart();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gold-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            pathname === '/' ? 'text-gold-600 font-bold' : 'text-obsidian-700 hover:text-gold-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">الرئيسية</span>
        </Link>

        <Link
          href="/categories"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            pathname.startsWith('/categories') ? 'text-gold-600 font-bold' : 'text-obsidian-700 hover:text-gold-600'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">الأقسام</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            pathname === '/products' ? 'text-gold-600 font-bold' : 'text-obsidian-700 hover:text-gold-600'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">الأصناف</span>
        </Link>

        {/* Booking Cart Trigger */}
        <button
          onClick={openDrawer}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-gold-700 hover:text-gold-800 relative"
          aria-label="حافظة الحجز"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-gold-500 text-obsidian-950 text-[9px] font-black rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">الحافظة</span>
        </button>

        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن التجهيزات لدى إسماعيل للأفراح')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('WHATSAPP_CLICK')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-emerald-600 font-semibold"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px]">واتساب</span>
        </a>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Phone, MessageCircle, Heart, Search, Menu, X, ShoppingBag } from 'lucide-react';
import { useFavorites } from './FavoritesProvider';
import { useBookingCart } from './BookingCartProvider';
import { trackEvent } from '../lib/analytics';

interface NavbarProps {
  phone?: string;
  whatsapp?: string;
  storeName?: string;
}

export default function Navbar({
  phone = '777949658',
  whatsapp = '777949658',
  storeName = 'إسماعيل للأفراح والمناسبات',
}: NavbarProps) {
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { cartCount, openDrawer } = useBookingCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الأقسام', href: '/categories' },
    { label: 'جميع الأصناف', href: '/products' },
    { label: 'أعمالنا', href: '/gallery' },
    { label: 'العروض', href: '/offers' },
    { label: 'من نحن', href: '/about' },
    { label: 'تواصل معنا', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gold-200/60 shadow-sm transition-all">
      {/* Top Banner with Contact Details */}
      <div className="bg-obsidian-900 text-gold-100 text-xs py-2 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>نستقبل طلباتكم وحجوزاتكم على مدار الساعة</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent('PHONE_CLICK')}
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span dir="ltr">{phone}</span>
            </a>
            <span className="text-obsidian-700">|</span>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تجهيزات المناسبات لدى إسماعيل للأفراح')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('WHATSAPP_CLICK')}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors text-emerald-300"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب مباشر</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-300 flex items-center justify-center shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-obsidian-900" />
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold tracking-tight text-obsidian-900 font-sans group-hover:text-gold-600 transition-colors">
                إسماعيل للأفراح
              </span>
              <span className="block text-xs font-semibold text-gold-600 tracking-wider">
                والمناسبات ومستلزماتها
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-gold-700 bg-gold-50 font-bold border border-gold-200'
                      : 'text-obsidian-700 hover:text-gold-600 hover:bg-cream-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, Favorites, Contact Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-obsidian-700 hover:text-gold-600 hover:bg-cream-100 transition-colors relative"
              title="بحث في الأصناف"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Booking Cart Icon */}
            <button
              onClick={openDrawer}
              className="p-2.5 rounded-xl text-obsidian-700 hover:text-gold-600 hover:bg-cream-100 transition-colors relative flex items-center gap-1.5"
              title="حافظة الحجز"
              aria-label="حافظة الحجز"
            >
              <ShoppingBag className="w-5 h-5 text-gold-700" />
              {cartCount > 0 && (
                <span className="bg-gold-500 text-obsidian-950 text-xs font-black rounded-full px-1.5 py-0.2 min-w-[20px] h-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className="p-2.5 rounded-xl text-obsidian-700 hover:text-gold-600 hover:bg-cream-100 transition-colors relative"
              title="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-obsidian-900 text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Quick WhatsApp CTA Button */}
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن التجهيزات')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('WHATSAPP_CLICK')}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل واتساب</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-obsidian-700 hover:text-gold-600 hover:bg-cream-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="bg-cream-50 border-t border-gold-200/80 px-4 py-3 shadow-inner transition-all animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gold-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن خيمة، سجاد، ترامس، كراسي، طرابيل، فناجين ضيافة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 bg-white border border-gold-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              بحث
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gold-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-gold-100/70 text-gold-800 font-bold border-r-4 border-gold-600'
                    : 'text-obsidian-800 hover:bg-cream-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gold-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>محادثة واتساب فورية</span>
            </a>
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gold-500 text-obsidian-900 rounded-xl font-bold shadow-sm"
            >
              <Phone className="w-5 h-5" />
              <span>اتصال هاتفي مباشر</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

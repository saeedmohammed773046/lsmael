import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { FavoritesProvider } from '../components/FavoritesProvider';
import { BookingCartProvider } from '../components/BookingCartProvider';
import BookingCartDrawer from '../components/BookingCartDrawer';
import FloatingBookingCart from '../components/FloatingBookingCart';
import { fetchSettings } from '../lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  return {
    title: {
      template: `%s | ${settings.storeName}`,
      default: `${settings.storeName} - تأجير وتجهيز مستلزمات الأفراح والخيام الملكية والطرابيل باليمن`,
    },
    description: settings.storeDescription,
    keywords: [
      'إسماعيل للأفراح',
      'تأجير خيام باليمن',
      'خيام ملكية',
      'طرابيل وظلال',
      'سجاد وموكيت أحمر',
      'ترامس شاي وقهوة',
      'فناجين وكاسات ضيافة',
      'كراسي وطاولات مناسبات',
      'مستلزمات أفراح اليمن',
      'تجهيز مناسبات وأعراس',
    ],
    authors: [{ name: settings.storeName }],
    openGraph: {
      title: settings.storeName,
      description: settings.storeDescription,
      type: 'website',
      locale: 'ar_YE',
      siteName: settings.storeName,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchSettings();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-gold-500 selection:text-obsidian-950">
        <FavoritesProvider>
          <BookingCartProvider>
            <Navbar phone={settings.phone} whatsapp={settings.whatsapp} storeName={settings.storeName} />
            <main className="flex-1">
              {children}
            </main>
            <Footer settings={settings} />
            <MobileBottomNav phone={settings.phone} whatsapp={settings.whatsapp} />
            <BookingCartDrawer storeWhatsApp={settings.whatsapp} storePhone={settings.phone} />
            <FloatingBookingCart />
          </BookingCartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

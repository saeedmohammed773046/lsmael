import { Category, Product, GalleryItem, Offer, SiteSettings, BookingPayload } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ismael-backend.onrender.com/api';
const ASSETS_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://ismael-backend.onrender.com';

export function getFullImageUrl(imagePath?: string | null): string {
  if (!imagePath) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${ASSETS_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  const normalized = digits.startsWith('967') ? digits : `967${digits.replace(/^0+/, '')}`;
  const textParam = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${normalized}${textParam}`;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function fetchProducts(params?: {
  categorySlug?: string;
  serviceType?: string;
  availability?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  try {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params?.serviceType) query.append('serviceType', params.serviceType);
    if (params?.availability) query.append('availability', params.availability);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/products?${query.toString()}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      return { products: data.data, pagination: data.pagination };
    }
    return { products: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  } catch {
    return { products: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/gallery`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(`${API_BASE}/offers`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
    const data = await res.json();
    return data.data;
  } catch {
    return {
      storeName: 'إسماعيل للأفراح والمناسبات ومستلزمات الأفراح',
      storeDescription: 'الوجهة الأولى لتأجير وتجهيز مستلزمات الأفراح والمناسبات الفاخرة.',
      phone: '773046703',
      whatsapp: '773046703',
      secondaryPhone: '701896696',
      email: 'ismail@gmail.com',
      address: 'اليمن - حضرموت - غيل باوزير - مقابل مؤسسة الروضة الاجتماعية',
      googleMapsUrl: 'https://maps.google.com',
      aboutUsText: 'إسماعيل للأفراح والمناسبات خياركم الأمثل لتجهيز كافة المناسبات.',
      workingHours: '{}',
      socialLinks: '{}',
      heroTitle: 'أفراحكم تكتمل بأرقى التجهيزات والخيام الملكية',
      heroSubtitle: 'نوفر أحدث الخيام، الطرابيل، السجاد، مستلزمات الضيافة العربية والجلسات بأعلى جودة.',
    };
  }
}

export async function submitBooking(payload: BookingPayload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

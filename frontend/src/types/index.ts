export type Role = 'ADMIN' | 'MANAGER' | 'EDITOR';
export type ServiceType = 'RENTAL' | 'SALE' | 'RENTAL_AND_SALE' | 'INQUIRY';
export type PriceType = 'FIXED' | 'STARTING_FROM' | 'CONTACT' | 'HIDDEN';
export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE';
export type BookingStatus = 'NEW' | 'CONTACTED' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imagePath?: string | null;
  isActive: boolean;
  sortOrder: number;
  productsCount?: number;
  createdAt?: string;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  imagePath: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  serviceType: ServiceType;
  price?: number | null;
  priceType: PriceType;
  availabilityStatus: AvailabilityStatus;
  isFeatured: boolean;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  relatedProducts?: Product[];
}

export interface BookingItem {
  id: string;
  productId?: string | null;
  productName: string;
  quantity: number;
  unitPrice?: number | null;
  daysCount?: number | null;
  lineTotal?: number | null;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
  notes?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: { imagePath: string }[];
  } | null;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  phone: string;
  customerLocation?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
  daysCount?: number | null;
  notes?: string | null;
  status: BookingStatus;
  totalEstimatedPrice?: number | null;
  createdAt: string;
  items: BookingItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  categoryTag?: string | null;
  eventDate?: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt?: string;
  images: {
    id?: string;
    imagePath: string;
    altText?: string | null;
    sortOrder: number;
    isPrimary: boolean;
  }[];
}

export interface Offer {
  id: string;
  title: string;
  description?: string | null;
  imagePath?: string | null;
  discountText?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface SiteSettings {
  storeName: string;
  storeDescription: string;
  phone: string;
  whatsapp: string;
  secondaryPhone?: string;
  email?: string;
  address: string;
  googleMapsUrl: string;
  aboutUsText: string;
  workingHours: string;
  socialLinks: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface CartBookingItem {
  id: string; // unique item id in cart
  productId: string;
  productName: string;
  productSlug: string;
  imagePath?: string;
  unitPrice: number;
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
  daysCount: number;
  lineTotal: number;
  eventType?: string;
  notes?: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  location: string;
}

export interface BookingPayload {
  customerName: string;
  phone: string;
  customerLocation?: string;
  eventType?: string;
  eventDate?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  daysCount?: number;
  totalEstimatedPrice?: number;
  notes?: string;
  items: {
    productId?: string;
    productName: string;
    quantity: number;
    unitPrice?: number;
    daysCount?: number;
    lineTotal?: number;
    rentalStartDate?: string;
    rentalEndDate?: string;
    notes?: string;
  }[];
}

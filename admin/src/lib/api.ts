const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ismael-backend.onrender.com/api';
const ASSETS_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://ismael-backend.onrender.com';

export function getFullImageUrl(imagePath?: string | null): string {
  if (!imagePath) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${ASSETS_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ismail_admin_token');
}

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    localStorage.removeItem('ismail_admin_token');
    localStorage.removeItem('ismail_admin_user');
    window.location.href = '/login';
  }

  return res.json();
}

export async function uploadSingleFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await adminFetch('/admin/upload/single', {
    method: 'POST',
    body: formData,
  });

  if (res.success) {
    return res.data.imagePath;
  }
  throw new Error(res.message || 'فشل رفع الصورة');
}

export async function uploadMultipleFiles(files: FileList | File[]): Promise<{ imagePath: string; isPrimary: boolean; sortOrder: number }[]> {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const res = await adminFetch('/admin/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  if (res.success) {
    return res.data;
  }
  throw new Error(res.message || 'فشل رفع الصور');
}

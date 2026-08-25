const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function trackEvent(eventType: 'PRODUCT_VIEW' | 'WHATSAPP_CLICK' | 'PHONE_CLICK' | 'BOOKING_CREATED' | 'CATEGORY_VIEW' | 'GALLERY_VIEW', referenceId?: string, metadata?: any) {
  if (typeof window === 'undefined') return;

  fetch(`${API_BASE}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, referenceId, metadata }),
  }).catch(() => {});
}

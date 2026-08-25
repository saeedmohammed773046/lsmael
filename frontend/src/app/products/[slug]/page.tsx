import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchSettings, getFullImageUrl } from '../../../lib/api';
import ProductDetailClient from '../../../components/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  const settings = await fetchSettings();

  if (!product) return { title: 'الصنف غير موجود' };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const imageUrl = getFullImageUrl(primaryImage?.imagePath);

  return {
    title: `${product.name} | ${settings.storeName}`,
    description: product.shortDescription || product.description || `تفاصيل وحجز ${product.name} من محل إسماعيل للأفراح.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || undefined,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const initialOpenBooking = resolvedSearchParams.booking === 'true';

  const [product, settings] = await Promise.all([
    fetchProductBySlug(slug),
    fetchSettings(),
  ]);

  if (!product) notFound();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || product.name,
    image: [getFullImageUrl(primaryImage?.imagePath)],
    offers: {
      '@type': 'Offer',
      price: product.price || '0',
      priceCurrency: 'SAR',
      availability: product.availabilityStatus === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient
        product={product}
        settings={settings}
        initialOpenBooking={initialOpenBooking}
      />
    </>
  );
}

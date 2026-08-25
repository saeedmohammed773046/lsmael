import React from 'react';
import { Metadata } from 'next';
import FavoritesClient from './FavoritesClient';
import { fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'أصنافي المفضلة',
  description: 'قائمة الأصناف والتجهيزات التي قمت بحفظها في المفضلة للرجوع إليها وحجزها.',
};

export default async function FavoritesPage() {
  const settings = await fetchSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <FavoritesClient whatsapp={settings.whatsapp} />
    </div>
  );
}

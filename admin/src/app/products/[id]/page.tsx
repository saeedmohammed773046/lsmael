'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../components/ProductForm';
import { adminFetch } from '../../../lib/api';
import { Product } from '../../../types';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminFetch(`/products/admin/${id}`);
        if (res.success) {
          setProduct(res.data);
        }
      } catch {} finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-gray-500">جاري تحميل بيانات الصنف...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-xs text-red-600 font-bold">
        لم يتم العثور على الصنف المطلوب
      </div>
    );
  }

  return <ProductForm initialData={product} isEditing={true} />;
}

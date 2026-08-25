'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { getFullImageUrl } from '../lib/api';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { imagePath: string; altText?: string | null }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowLeft' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="إغلاق"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Right (Previous in RTL) */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="الصورة السابقة"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Navigation Left (Next in RTL) */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="الصورة التالية"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image Container */}
      <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full h-[75vh]">
          <Image
            src={getFullImageUrl(currentImg.imagePath)}
            alt={currentImg.altText || 'صورة الصنف'}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
        {currentImg.altText && (
          <p className="text-white/80 text-sm mt-3 bg-black/40 px-4 py-1.5 rounded-full">
            {currentImg.altText} ({currentIndex + 1} / {images.length})
          </p>
        )}
      </div>
    </div>
  );
}

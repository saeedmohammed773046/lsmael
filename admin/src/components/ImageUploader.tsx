'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { ProductImage } from '../types';
import { getFullImageUrl, uploadMultipleFiles, uploadSingleFile } from '../lib/api';

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  single?: boolean;
}

export default function ImageUploader({ images, onChange, single = false }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (single) {
        const imagePath = await uploadSingleFile(files[0]);
        onChange([
          {
            imagePath,
            altText: files[0].name,
            sortOrder: 0,
            isPrimary: true,
          },
        ]);
      } else {
        const uploaded = await uploadMultipleFiles(files);
        const newImages: ProductImage[] = [
          ...images,
          ...uploaded.map((u, i) => ({
            imagePath: u.imagePath,
            altText: '',
            sortOrder: images.length + i,
            isPrimary: images.length === 0 && i === 0,
          })),
        ];
        onChange(newImages);
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء رفع الصور');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const wasPrimary = images[index].isPrimary;
    const updated = images.filter((_, i) => i !== index);

    // If removed image was primary, set first remaining image as primary
    if (wasPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated.map((img, idx) => ({ ...img, sortOrder: idx })));
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-gold-500 bg-gold-50'
            : 'border-gray-300 hover:border-gold-400 bg-gray-50/50 hover:bg-gold-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!single}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto">
            {uploading ? (
              <span className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-obsidian-800">
              {uploading
                ? 'جاري رفع ومعالجة الصور...'
                : single
                ? 'اضغط لاختيار صورة أو اسحبها هنا'
                : 'اضغط لاختيار صور متعددة أو اسحبها هنا'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              الصيغ المدعومة: PNG, JPG, WEBP, SVG (حجم أقصى 10 ميجابايت)
            </p>
          </div>
        </div>
      </div>

      {/* Images Previews List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className={`relative bg-white rounded-2xl overflow-hidden border shadow-sm group ${
                img.isPrimary ? 'border-gold-500 ring-2 ring-gold-400/50' : 'border-gray-200'
              }`}
            >
              <div className="relative w-full h-32 bg-gray-100">
                <Image
                  src={getFullImageUrl(img.imagePath)}
                  alt={img.altText || 'صورة الصنف'}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Primary Badge */}
              {img.isPrimary && (
                <div className="absolute top-2 right-2 bg-gold-500 text-obsidian-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                  <Star className="w-3 h-3 fill-obsidian-950" />
                  <span>الرئيسية</span>
                </div>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 shadow transition-colors"
                title="حذف الصورة"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Action Toolbar */}
              <div className="p-2 bg-white flex items-center justify-between border-t border-gray-100 text-xs">
                {!img.isPrimary ? (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="text-[11px] font-bold text-gold-700 hover:text-gold-900"
                  >
                    تعيين كرئيسية
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600">الصورة الأساسية</span>
                )}

                {/* Reorder buttons */}
                {!single && images.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, index - 1)}
                      className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      title="تحريك لليمين"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, index + 1)}
                      className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      title="تحريك لليسار"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

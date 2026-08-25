'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  favoritesCount: 0,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ismail_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      try {
        localStorage.setItem('ismail_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

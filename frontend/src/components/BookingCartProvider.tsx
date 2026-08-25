'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartBookingItem, CustomerProfile } from '../types';

interface BookingCartContextType {
  items: CartBookingItem[];
  customer: CustomerProfile;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (item: {
    productId: string;
    productName: string;
    productSlug: string;
    imagePath?: string;
    unitPrice: number;
    quantity: number;
    rentalStartDate: string;
    rentalEndDate: string;
    eventType?: string;
    notes?: string;
  }) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateItemDates: (itemId: string, startDate: string, endDate: string) => void;
  clearCart: () => void;
  updateCustomerProfile: (profile: Partial<CustomerProfile>) => void;
  cartCount: number;
  cartGrandTotal: number;
}

const BookingCartContext = createContext<BookingCartContextType | undefined>(undefined);

// Helper to calculate days difference between two dates (min 1 day)
export const calculateDaysDifference = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const BookingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartBookingItem[]>([]);
  const [customer, setCustomer] = useState<CustomerProfile>({
    name: '',
    phone: '',
    location: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ismail_booking_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCustomer = localStorage.getItem('ismail_customer_profile');
      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ismail_booking_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ismail_customer_profile', JSON.stringify(customer));
    } catch (e) {}
  }, [customer, isLoaded]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const addToCart = (data: {
    productId: string;
    productName: string;
    productSlug: string;
    imagePath?: string;
    unitPrice: number;
    quantity: number;
    rentalStartDate: string;
    rentalEndDate: string;
    eventType?: string;
    notes?: string;
  }) => {
    const days = calculateDaysDifference(data.rentalStartDate, data.rentalEndDate);
    const lineTotal = data.unitPrice * data.quantity * days;

    const newItem: CartBookingItem = {
      id: `${data.productId}-${Date.now()}`,
      productId: data.productId,
      productName: data.productName,
      productSlug: data.productSlug,
      imagePath: data.imagePath,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      rentalStartDate: data.rentalStartDate,
      rentalEndDate: data.rentalEndDate,
      daysCount: days,
      lineTotal,
      eventType: data.eventType,
      notes: data.notes,
    };

    setItems((prev) => [...prev, newItem]);
    setIsDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const lineTotal = item.unitPrice * quantity * item.daysCount;
          return { ...item, quantity, lineTotal };
        }
        return item;
      })
    );
  };

  const updateItemDates = (itemId: string, startDate: string, endDate: string) => {
    const days = calculateDaysDifference(startDate, endDate);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const lineTotal = item.unitPrice * item.quantity * days;
          return {
            ...item,
            rentalStartDate: startDate,
            rentalEndDate: endDate,
            daysCount: days,
            lineTotal,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateCustomerProfile = (profile: Partial<CustomerProfile>) => {
    setCustomer((prev) => ({ ...prev, ...profile }));
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartGrandTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <BookingCartContext.Provider
      value={{
        items,
        customer,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        updateItemDates,
        clearCart,
        updateCustomerProfile,
        cartCount,
        cartGrandTotal,
      }}
    >
      {children}
    </BookingCartContext.Provider>
  );
};

export const useBookingCart = () => {
  const context = useContext(BookingCartContext);
  if (!context) {
    throw new Error('useBookingCart must be used within a BookingCartProvider');
  }
  return context;
};

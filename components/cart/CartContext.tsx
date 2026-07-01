'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Generate a unique guestId per browser Tab (sessionStorage)
function getGuestId(): string {
  if (typeof window === 'undefined') return 'default';
  let id = sessionStorage.getItem('guestId');
  if (!id) {
    id = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('guestId', id);
  }
  return id;
}

function getCartKey(guestId: string): string {
  return `cart_${guestId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Lazily initialize guestId and cart from storage to avoid setState-in-effect lint error
  const [guestId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'default';
    return getGuestId();
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const id = getGuestId();
    try {
      const stored = localStorage.getItem(getCartKey(id));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (guestId) {
      localStorage.setItem(getCartKey(guestId), JSON.stringify(cart));
    }
  }, [cart, guestId]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
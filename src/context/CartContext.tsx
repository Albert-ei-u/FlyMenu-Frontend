"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

interface CartContextType {
  cart: CartItem[];
  restaurantId: string | null;
  addToCart: (item: CartItem, restaurantId: string) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const addToCart = (item: CartItem, resId: string) => {
    if (restaurantId && restaurantId !== resId) {
      if (confirm("Clear cart and start new order from this restaurant?")) {
        setCart([item]);
        setRestaurantId(resId);
      }
      return;
    }
    
    setRestaurantId(resId);
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <CartContext.Provider
      value={{ cart, restaurantId, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

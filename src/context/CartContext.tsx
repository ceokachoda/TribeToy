"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "@/data/products";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/utils/supabase/client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { showToast } = useToast();
  const supabase = createClient();

  // Load user session
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
      setIsLoaded(true);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch cart from DB or LocalStorage
  useEffect(() => {
    const loadCart = async () => {
      if (!isLoaded) return;

      const localCartStr = localStorage.getItem("tribetoy_cart");
      let localCart: CartItem[] = [];
      try {
        if (localCartStr) localCart = JSON.parse(localCartStr);
      } catch (e) {
        console.error("Failed to parse local cart");
      }

      if (userId) {
        // Merge local cart into DB if present
        if (localCart.length > 0) {
          for (const item of localCart) {
            // Check if exists in DB
            const { data: existing } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('user_id', userId)
              .eq('product_id', item.id)
              .maybeSingle();

            if (existing) {
              await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + item.quantity })
                .eq('id', existing.id);
            } else {
              await supabase
                .from('cart_items')
                .insert({
                  user_id: userId,
                  product_id: item.id,
                  quantity: item.quantity
                });
            }
          }
          localStorage.removeItem("tribetoy_cart");
        }

        // Fetch DB cart
        const { data: dbCartItems, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            quantity,
            product_id,
            products (id, name, category, price, original_price, image_url, is_new, is_sale, is_premium)
          `)
          .eq('user_id', userId);

        if (!error && dbCartItems) {
          const mappedDbCart: CartItem[] = dbCartItems.map((row: any) => ({
            id: row.products.id,
            name: row.products.name,
            category: row.products.category,
            price: `₹${parseFloat(row.products.price).toFixed(2)}`,
            originalPrice: row.products.original_price ? `₹${parseFloat(row.products.original_price).toFixed(2)}` : undefined,
            image: row.products.image_url || "",
            isNew: row.products.is_new,
            isSale: row.products.is_sale,
            isPremium: row.products.is_premium,
            quantity: row.quantity
          }));
          setCart(mappedDbCart);
        }
      } else {
        // Logged out
        setCart(localCart);
      }
    };

    loadCart();
  }, [userId, isLoaded]);

  // Sync to local storage if logged out
  useEffect(() => {
    if (isLoaded && !userId) {
      localStorage.setItem("tribetoy_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded, userId]);

  const addToCart = async (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    if (userId) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: product.id,
            quantity: 1
          });
      }
    }
    showToast(`Added ${product.name} to cart`, "cart");
  };

  const removeFromCart = async (id: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', id);
    }
  };

  const updateQuantity = async (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (userId) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', id);
    }
  };

  const clearCart = useCallback(async () => {
    setCart([]);
    if (userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
    }
  }, [userId]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const totalPrice = cart.reduce((acc, item) => {
    const priceStr = item.price.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(priceStr) || 0;
    return acc + (priceVal * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isLoading: !isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

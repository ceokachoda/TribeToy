"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
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
  const supabase = useMemo(() => createClient(), []);

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
  }, [supabase]);

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
  }, [userId, isLoaded, supabase]);

  // Sync to local storage if logged out
  useEffect(() => {
    if (isLoaded && !userId) {
      localStorage.setItem("tribetoy_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded, userId]);

  const addToCart = useCallback(async (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`, "cart");

    if (userId) {
      try {
        const { data: existing, error: fetchError } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', userId)
          .eq('product_id', product.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: userId,
              product_id: product.id,
              quantity: 1
            });
          if (error) throw error;
        }
      } catch (error) {
        console.error("Cart sync error", error);
        setCart((prev) => {
          const existing = prev.find((item) => item.id === product.id);
          if (existing && existing.quantity > 1) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
            );
          }
          return prev.filter((item) => item.id !== product.id);
        });
        showToast("Failed to sync cart", "error");
      }
    }
  }, [userId, supabase, showToast]);

  const removeFromCart = useCallback(async (id: number | string) => {
    let removedItem: CartItem | undefined;
    setCart((prev) => {
      removedItem = prev.find((item) => item.id === id);
      return prev.filter((item) => item.id !== id);
    });

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', id);
        if (error) throw error;
      } catch (error) {
        console.error("Cart sync error", error);
        if (removedItem) {
          setCart((prev) => [...prev, removedItem!]);
        }
        showToast("Failed to remove item", "error");
      }
    }
  }, [userId, supabase, showToast]);

  const updateQuantity = useCallback(async (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    let oldQuantity = 0;
    setCart((prev) => {
      const item = prev.find(i => i.id === id);
      if (item) oldQuantity = item.quantity;
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('product_id', id);
        if (error) throw error;
      } catch (error) {
        console.error("Cart sync error", error);
        if (oldQuantity > 0) {
          setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: oldQuantity } : item)));
        }
        showToast("Failed to update quantity", "error");
      }
    }
  }, [userId, supabase, showToast, removeFromCart]);

  const clearCart = useCallback(async () => {
    const previousCart = [...cart];
    setCart([]);
    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
        if (error) throw error;
      } catch (error) {
        console.error("Cart sync error", error);
        setCart(previousCart);
        showToast("Failed to clear cart", "error");
      }
    }
  }, [userId, supabase, showToast, cart]);

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  
  const totalPrice = useMemo(() => cart.reduce((acc, item) => {
    const priceStr = item.price.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(priceStr) || 0;
    return acc + (priceVal * item.quantity);
  }, 0), [cart]);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading: !isLoaded
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isLoaded]);

  return (
    <CartContext.Provider value={contextValue}>
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

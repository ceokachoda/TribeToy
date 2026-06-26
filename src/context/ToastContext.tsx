"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Heart, ShoppingBag, X } from "lucide-react";

type ToastType = "success" | "wishlist" | "cart" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 z-[200] flex flex-col items-center lg:items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{ willChange: "transform, opacity" }}
              className="pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-black/5 min-w-[300px]"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f4f5f4] flex items-center justify-center text-[#4a5d4e] shadow-sm">
                {toast.type === "success" && <CheckCircle2 size={18} />}
                {toast.type === "wishlist" && <Heart size={18} className="fill-[#4a5d4e]" />}
                {toast.type === "cart" && <ShoppingBag size={18} />}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-[#1a1a1a]">{toast.message}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-[#8a958c] hover:text-[#1a1a1a] transition-colors p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

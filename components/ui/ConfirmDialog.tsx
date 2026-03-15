"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div 
        className="relative w-full max-w-sm bg-surface/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-8 overflow-hidden animate-in fade-in zoom-in duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-3 ${
            variant === "danger" 
              ? "bg-red-500/10 text-red-500" 
              : "bg-primary/10 text-primary"
          }`}>
            <span className="material-symbols-outlined text-[36px] font-fill">
              {variant === "danger" ? "logout" : "help"}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-text-main tracking-tight">
              {title}
            </h3>
            <p className="text-base text-text-sub leading-relaxed px-2">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-text-sub hover:bg-surface-hover hover:text-text-main transition-all border border-border/50 active:scale-[0.98] whitespace-nowrap"
            >
              {cancelText}
            </button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3.5 text-sm font-black border-0 shadow-2xl transition-all active:scale-[0.98] whitespace-nowrap ${
                variant === "danger" 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30" 
                  : "bg-primary hover:bg-primary-hover text-black shadow-primary/30"
              }`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

"use client";

import React from "react";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
}

/**
 * Modal para previsualizar comprobantes (Imágenes o PDFs).
 */
export function ReceiptPreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName = "Comprobante",
}: ReceiptPreviewModalProps) {
  if (!isOpen) return null;

  const isPDF = fileUrl.toLowerCase().includes(".pdf") || fileUrl.includes("signedUrl") && fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            <h3 className="font-bold text-text-main truncate max-w-[200px] sm:max-w-md">
              {fileName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-text-sub hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
              title="Abrir en pestaña nueva"
            >
              <span className="material-symbols-outlined text-xl">open_in_new</span>
              <span className="hidden sm:inline">Expandir</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-text-sub hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 overflow-auto bg-black/20 flex items-center justify-center p-4">
          {isPDF ? (
            <iframe 
              src={fileUrl} 
              className="w-full h-full min-h-[60vh] rounded-lg border border-border"
              title="Visor PDF"
            />
          ) : (
            <img 
              src={fileUrl} 
              alt="Comprobante" 
              className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
            />
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName = "Comprobante",
}: ReceiptPreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const urlWithoutQuery = fileUrl.split("?")[0];
  const extension = urlWithoutQuery.split(".").pop()?.toLowerCase() || "";

  const isPDF = extension === "pdf";
  const isWord = ["doc", "docx"].includes(extension);
  const isExcel = ["xls", "xlsx"].includes(extension);
  const isImage = ["jpeg", "jpg", "gif", "png", "webp", "svg", "heic"].includes(
    extension,
  );

  let docIcon = "description";
  let docType = "Documento adjunto";

  if (isWord) {
    docIcon = "description";
    docType = "Documento de Word";
  } else if (isExcel) {
    docIcon = "table_view";
    docType = "Hoja de cálculo";
  } else if (isPDF) {
    docIcon = "picture_as_pdf";
    docType = "Documento PDF";
  }

  const renderFallbackCard = () => (
    <div
      className="relative group bg-surface p-8 rounded-[2rem] shadow-2xl border border-border flex flex-col items-center justify-center gap-6 text-center max-w-xs sm:max-w-sm w-full mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-inner">
        <span className="material-symbols-outlined text-primary text-[56px] drop-shadow-md">
          {docIcon}
        </span>
      </div>

      <div className="flex flex-col gap-2 w-full px-2">
        <h4 className="text-text-main text-xl md:text-2xl font-black line-clamp-2 tracking-tight">
          {fileName}
        </h4>
        <p className="text-text-sub text-xs font-bold uppercase tracking-wider">
          {docType}
        </p>
      </div>

      <button
        onClick={() => window.open(fileUrl, "_blank")}
        className="w-full h-14 mt-4 bg-primary hover:bg-primary-hover text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-xl shadow-primary/20 text-base"
      >
        <span className="material-symbols-outlined text-[24px]">
          open_in_new
        </span>
        Abrir archivo
      </button>
    </div>
  );

  const content = (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Immersive Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-500" />

      {/* Floating Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-[2001] size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
      >
        <span className="material-symbols-outlined text-[28px]">close</span>
        {/* Subtle tooltip */}
        <span className="absolute top-full mt-2 text-[10px] font-bold uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
          Cerrar
        </span>
      </button>

      {/* External Link Button (Optional but useful) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(fileUrl, "_blank");
        }}
        className="absolute top-6 left-6 z-[2001] h-12 px-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group sm:flex hidden"
      >
        <span className="material-symbols-outlined text-[20px]">
          open_in_new
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">
          Ver original
        </span>
      </button>

      {/* Main Content Container */}
      <div className="relative z-10 w-full mb-10 h-full max-w-5xl flex items-center justify-center animate-in zoom-in-95 duration-300">
        {isImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
            <div
              className="relative group overflow-hidden rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] border border-white/5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(fileUrl, "_blank");
              }}
            >
              <img
                src={fileUrl}
                alt="Comprobante"
                className="max-w-full max-h-[80vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>

            {/* Minimal Info Label */}
            <div
              className="flex flex-col items-center gap-1 group"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white/90 font-bold text-lg sm:text-2xl drop-shadow-lg text-center px-4">
                {fileName}
              </span>
              <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase tracking-[0.3em]">
                <div className="h-px w-8 bg-white/20" />
                Comprobante de Gasto
                <div className="h-px w-8 bg-white/20" />
              </div>
            </div>
          </div>
        ) : isPDF ? (
          <>
            {/* Desktop PDF Viewer */}
            <div
              className="hidden sm:block w-full h-full bg-surface rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={fileUrl}
                className="w-full h-full min-h-[60vh]"
                title="Visor PDF"
              />
            </div>
            {/* Mobile Fallback for PDF */}
            <div className="sm:hidden w-full h-full flex items-center justify-center">
              {renderFallbackCard()}
            </div>
          </>
        ) : (
          /* General Fallback for Word, Excel, etc */
          <div className="w-full h-full flex items-center justify-center">
            {renderFallbackCard()}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

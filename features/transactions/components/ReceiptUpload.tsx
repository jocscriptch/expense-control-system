"use client";

import React, { useRef, useState } from "react";
import { useReceiptUpload } from "../hooks/useReceiptUpload";

interface ReceiptUploadProps {
  onFileSelect: (file: File | null) => void;
}

/**
 * Componente de subida de comprobantes.
 * Soporta Drag & Drop, Clic para abrir el explorador y visualización de carga.
 */
export function ReceiptUpload({ onFileSelect }: ReceiptUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { isUploading, fileName, handleFileChange, removeFile } =
    useReceiptUpload(onFileSelect);

  // 1. Manejadores de Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // 2. Manejador de Clic
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <label className="text-sm font-medium text-text-main mb-2 block">
        Comprobante
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-background hover:border-primary hover:bg-primary/5"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFileChange(e.target.files[0])
          }
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />

        {/* Estado: Subiendo */}
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-xs text-text-sub">Subiendo {fileName}...</p>
          </div>
        ) : fileName ? (
          /* Estado: Archivo Seleccionado */
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="material-symbols-outlined text-primary text-3xl">
              task
            </span>
            <div className="flex items-center gap-2 max-w-full">
              <p className="text-xs font-medium text-text-main truncate max-w-[150px]">
                {fileName}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-text-dim hover:text-red-500 transition-colors"
                title="Eliminar archivo"
              >
                <span className="material-symbols-outlined text-[18px]">
                  cancel
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Estado: Vacío (Default) */
          <>
            <span className="material-symbols-outlined text-text-dim group-hover:text-primary mb-1 text-3xl">
              cloud_upload
            </span>
            <p className="text-xs text-text-sub">
              <span className="font-semibold text-primary">
                Clic para subir
              </span>
              {" o arrastra aquí"}
            </p>
            <p className="text-[10px] text-text-dim mt-1 uppercase">
              PDF, WORD, EXCEL, PNG, JPG (Máx 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { toast } from "react-hot-toast";
import { processImage } from "@/lib/utils/image";

/**
 * Hook para gestionar la carga de comprobantes (imágenes o documentos).
 * Valida el tamaño, el tipo y opcionalmente optimiza las imágenes.
 */
export function useReceiptUpload(onFileSelect: (file: File | null) => void) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    // 1. Validaciones básicas (Máx 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("El archivo es demasiado grande (máx 10MB).");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isDoc = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(file.type);

    if (!isImage && !isDoc) {
      toast.error(
        "Formato no soportado (PDF, Excel, Word o Imagen solamente)."
      );
      return;
    }

    setFileName(file.name);

    try {
      let fileToUpload = file;

      // 2. Optimización opcional de imágenes (Cliente)
      if (isImage) {
        const toastId = toast.loading("Optimizando imagen...");
        fileToUpload = await processImage(file);
        toast.dismiss(toastId);
      }

      // 3. Notificar al componente del archivo listo (Sin subir aún)
      onFileSelect(fileToUpload);
    } catch (error) {
      console.error("Error en useReceiptUpload:", error);
      toast.error("Error al procesar el archivo");
      setFileName(null);
    }
  };

  const removeFile = () => {
    setFileName(null);
    onFileSelect(null);
  };

  return {
    isUploading: false, // Ya no hay subida asíncrona en este hook
    fileName,
    handleFileChange,
    removeFile,
  };
}

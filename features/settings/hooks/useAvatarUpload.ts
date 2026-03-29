import { useState } from "react";
import { toast } from "react-hot-toast";
import { processImage } from "@/lib/utils/image";
import { updateAvatar } from "../actions";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook para gestionar la carga y optimización del avatar del usuario.
 */
export function useAvatarUpload(userId: string) {
  const { refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleAvatarChange = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      toast.error("La imagen original es demasiado pesada (máx 25MB).");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Procesando y optimizando imagen...");

    try {
      const optimizedFile = await processImage(file);

      toast.loading("Subiendo imagen optimizada...", { id: toastId });

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", optimizedFile);

      const result = await updateAvatar(formData);

      if (result.success) {
        setIsImageLoading(true);
        await refreshUser();
        toast.success(result.message || "Imagen actualizada", { id: toastId });
      } else {
        toast.error(result.error || "Error al subir", { id: toastId });
      }
    } catch (error) {
      toast.error("Error al subir la imagen", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    isImageLoading,
    setIsImageLoading,
    handleAvatarChange,
  };
}

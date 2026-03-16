/**
 * Procesa una imagen en el cliente para:
 * 1. Redimensionarla (máx 1000px por defecto).
 * 2. Comprimirla (WebP 0.8 por defecto).
 * 3. ELIMINAR metadatos EXIF (al redibujar en canvas).
 */
export const processImage = async (
  file: File, 
  maxSize: number = 1000, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Exportamos a webp por ser el formato más eficiente
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const processedFile = new File([blob], fileName, { type: "image/webp" });
              resolve(processedFile);
            } else {
              reject(new Error("Error al convertir a Blob"));
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
  });
};

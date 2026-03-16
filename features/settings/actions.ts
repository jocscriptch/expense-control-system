"use server";

import { createClient } from "@/lib/supabase/server";
import { translateError } from "@/features/auth/utils";
import type { AuthResponse, User } from "@/features/auth/types";
import { revalidatePath } from "next/cache";

/**
 * Actualiza los datos del perfil del usuario en la tabla 'users'.
 * Filtra automáticamente los campos de seguridad que no pertenecen a esta tabla.
 * 
 * @param userId - ID único del usuario.
 * @param data - Objeto con los campos a actualizar (nombre, bio, etc).
 * @returns AuthResponse con el resultado de la operación.
 */
export async function updateProfile(
  userId: string,
  data: any
): Promise<AuthResponse> {
  const supabase = await createClient();

  // Extraemos los campos que NO van a la tabla de base de datos
  const { currentPassword, password, confirmPassword, ...dbData } = data;

  const { error } = await supabase
    .from("users")
    .update({
      ...dbData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error al actualizar perfil:", error);
    return { success: false, error: translateError(error.message) };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Perfil actualizado correctamente" };
}

/**
 * Sube una nueva imagen de avatar al bucket de storage y actualiza la URL en la tabla 'users'.
 * Maneja la limpieza de archivos antiguos y la generación de una URL única para evitar problemas de caché.
 * 
 * @param formData - Contenedor con 'userId' y el archivo 'file' optimizado.
 * @returns AuthResponse con el resultado de la operación y la URL final.
 */
export async function updateAvatar(
  formData: FormData
): Promise<AuthResponse> {
  const userId = formData.get("userId") as string;
  const file = formData.get("file") as File;

  const supabase = await createClient();
  if (!file || !userId) {
    return { success: false, error: "Datos incompletos para la subida" };
  }
  // 1. Limpiar archivos antiguos para asegurar que no se acumulen
  const { data: existingFiles } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (existingFiles && existingFiles.length > 0) {
    const pathsToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from("avatars").remove(pathsToDelete);
  }

  // 2. Nombre ÚNICO con timestamp para REVENTAR la caché del CDN y del Dashboard
  // processImage siempre nos envía un webp, así que forzamos esa extensión
  const timestamp = Date.now();
  const filePath = `${userId}/avatar_${timestamp}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: "image/webp"
    });

  if (uploadError) {
    console.error("Error al subir avatar a Storage:", uploadError);
    return { success: false, error: "Error al subir la imagen" };
  }

  // 2. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // 3. Actualizar tabla 'users'
  const finalUrl = `${publicUrl}?t=${Date.now()}`;
  
  const { error: updateError } = await supabase
    .from("users")
    .update({
      avatar_url: finalUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Error al actualizar URL de avatar:", updateError);
    return { success: false, error: "Error al actualizar la foto de perfil" };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Foto de perfil actualizada", data: finalUrl };
}

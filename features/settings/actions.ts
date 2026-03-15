"use server";

import { createClient } from "@/lib/supabase/server";
import { translateError } from "@/features/auth/utils";
import type { AuthResponse, User } from "@/features/auth/types";
import { revalidatePath } from "next/cache";

/**
 * Actualiza los datos del perfil del usuario en la tabla 'users'.
 */
export async function updateProfile(
  userId: string,
  data: Partial<Pick<User, "name" | "bio" | "currency" | "language" | "theme">>
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({
      ...data,
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
 */
export async function updateAvatar(
  userId: string,
  file: File
): Promise<AuthResponse> {
  const supabase = await createClient();

  // 1. Limpiar archivos antiguos para asegurar que solo exista UNO (independientemente de la extensión)
  const { data: existingFiles } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (existingFiles && existingFiles.length > 0) {
    const pathsToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
    const { error: deleteError } = await supabase.storage.from("avatars").remove(pathsToDelete);
    if (deleteError) {
      console.error("Error al eliminar archivos antiguos:", deleteError);
    }
  }

  // 2. Subir el nuevo archivo con un nombre fijo para que upsert funcione si fuera necesario
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    console.error("Error al subir avatar:", uploadError);
    return { success: false, error: "Error al subir la imagen" };
  }

  // 2. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // 3. Actualizar tabla 'users'
  const { error: updateError } = await supabase
    .from("users")
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Error al actualizar URL de avatar:", updateError);
    return { success: false, error: "Error al actualizar la foto de perfil" };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Foto de perfil actualizada", data: publicUrl };
}

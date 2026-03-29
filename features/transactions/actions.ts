"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TransactionFormValues } from "./schema";
import type { TransactionResponse, Category } from "./types";

/**
 * Registra una nueva transacción en la base de datos de Supabase.
 * Valida la sesión del usuario antes de proceder.
 */
export async function createTransaction(
  formData: TransactionFormValues
): Promise<TransactionResponse> {
  const supabase = await createClient();

  try {
    // 1. Obtener el usuario autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("No tienes una sesión activa. Por favor, inicia sesión.");
    }

    let attachmentUrl = formData.attachment_url || null;

    // 2. Si hay un archivo, realizar la subida interna antes del INSERT
    if (formData.file && formData.file instanceof File) {
      const file = formData.file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error al subir comprobante en lote:", uploadError);
        throw new Error("No se pudo subir el comprobante. Registro cancelado.");
      }
      
      attachmentUrl = fileName; // Guardamos la ruta en la DB
    }

    // 3. Insertar la transacción
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          category_id: formData.category_id,
          amount: formData.amount,
          date: formData.date || new Date().toISOString().split("T")[0],
          description: formData.description || "",
          payment_method: formData.payment_method,
          is_recurring: formData.is_recurring,
          is_household: formData.is_household,
          is_shared: formData.is_shared,
          attachment_url: attachmentUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error Supabase:", error);
      throw new Error(error.message);
    }
    
    // 4. Revalidar
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "¡Gasto registrado exitosamente!",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Ocurrió un error al registrar el gasto.",
    };
  }
}

/**
 * Obtiene las categorías configuradas por el usuario.
 * Se utiliza para poblar el selector de categorías en el formulario.
 */
export async function getCategories(): Promise<{
  success: boolean;
  data: Category[];
  error?: string;
}> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return { success: true, data: data as Category[] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}


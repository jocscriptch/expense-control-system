"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TransactionFormValues } from "./schema";
import type { TransactionResponse, Category, Transaction, TransactionWithCategory } from "./types";
import { getUser } from "@/features/auth/actions";

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
    
    // 4. Revalidar de forma anidada todo el dashboard (tabla y metricas)
    revalidatePath("/dashboard", "layout");

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

/**
 * Obtiene el resumen consolidado para el Dashboard:
 * Gasto del mes, Ingresos del mes y el Presupuesto Global.
 */
export async function getDashboardSummary() {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // Traer transacciones del mes actual con su categoría
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        date,
        description,
        category:categories (
          id,
          name,
          icon,
          color,
          type
        )
      `)
      .eq("user_id", user.id)
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: false });

    if (error) throw error;

    let totalExpenses = 0;
    let totalIncomes = 0;

    const typedTransactions = (transactions || [])
      .filter((t: any) => t.category?.type === "expense")
      .map((t: any) => {
        const amount = Number(t.amount);
        totalExpenses += amount;
        return {
          ...t,
          category: t.category
        };
      });

    const monthlyBudget = Number(user.monthly_budget || 0);
    const remainingBudget = monthlyBudget - totalExpenses;
    const usedPercentage = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
    const availableBalance = monthlyBudget - totalExpenses;

    return {
      success: true,
      data: {
        totalExpenses,
        totalIncomes,
        monthlyBudget,
        remainingBudget,
        usedPercentage: Math.min(usedPercentage, 100),
        availableBalance,
        recentTransactions: typedTransactions.slice(0, 5), // Top 5 recientes
      }
    };
  } catch (error: any) {
    console.error("Error getDashboardSummary:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todas las transacciones del usuario con datos de su categoría.
 */
export async function getTransactionsAction(): Promise<{
  success: boolean;
  data: TransactionWithCategory[];
  error?: string;
}> {
  const supabase = await createClient();
  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id, user_id, category_id, amount, date, description,
        payment_method, is_recurring, is_household, is_shared,
        attachment_url, created_at,
        category:categories ( id, name, icon, color, type )
      `)
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) throw new Error(error.message);

    return { success: true, data: (data || []) as unknown as TransactionWithCategory[] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Elimina una transacción por su ID.
 */
export async function deleteTransactionAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene un gasto por su ID para modo edición.
 */
export async function getTransactionByIdAction(id: string): Promise<{
  success: boolean;
  data?: TransactionWithCategory;
  error?: string;
}> {
  const supabase = await createClient();
  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id, user_id, category_id, amount, date, description,
        payment_method, is_recurring, is_household, is_shared,
        attachment_url, created_at,
        category:categories ( id, name, icon, color, type )
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data: data as unknown as TransactionWithCategory };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza una transacción existente en la base de datos.
 */
export async function updateTransactionAction(
  id: string,
  formData: TransactionFormValues
): Promise<TransactionResponse> {
  const supabase = await createClient();
  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("transactions")
      .update({
        category_id: formData.category_id,
        amount: formData.amount,
        date: formData.date || new Date().toISOString().split("T")[0],
        description: formData.description || "",
        payment_method: formData.payment_method,
        is_recurring: formData.is_recurring,
        is_household: formData.is_household,
        is_shared: formData.is_shared,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Manejo de archivos si se sube uno nuevo en la edición
    if (formData.file && formData.file instanceof File) {
      // 1. Borrar el anterior si existe
      if (data.attachment_url) {
        await supabase.storage.from("receipts").remove([data.attachment_url]);
      }

      // 2. Subir el nuevo
      const file = formData.file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, file);

      if (!uploadError) {
        await supabase
          .from("transactions")
          .update({ attachment_url: fileName })
          .eq("id", id);
      }
    }

    revalidatePath("/dashboard", "layout");

    return { success: true, message: "Gasto actualizado correctamente.", data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Genera una URL firmada para visualizar un comprobante de forma segura.
 */
export async function getReceiptSignedUrlAction(path: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.storage
      .from("receipts")
      .createSignedUrl(path, 60); // 1 minuto de validez

    if (error) throw error;
    return { success: true, url: data.signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un archivo del storage y limpia el campo en la transacción.
 */
export async function deleteReceiptAction(transactionId: string, path: string) {
  const supabase = await createClient();
  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    // 1. Borrar del storage
    const { error: storageError } = await supabase.storage
      .from("receipts")
      .remove([path]);

    if (storageError) throw storageError;

    // 2. Limpiar en la DB
    const { error: dbError } = await supabase
      .from("transactions")
      .update({ attachment_url: null })
      .eq("id", transactionId)
      .eq("user_id", user.id);

    if (dbError) throw dbError;

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  CategoryActionResponse,
  CategoryFormData,
  CategoryWithBudget,
} from "./types";

/**
 * Obtiene todas las categorías del usuario, incluyendo su presupuesto asociado.
 */
export async function getCategoriesWithBudgetsAction(): Promise<CategoryActionResponse> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // Consulta con join para traer el presupuesto si existe
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        budget:budgets (
          id,
          amount_limit,
          period
        ),
        transactions (count)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return {
      success: true,
      data: data.map((cat) => ({
        ...cat,
        budget: Array.isArray(cat.budget) ? cat.budget[0] : cat.budget,
        transactionCount: Array.isArray(cat.transactions) && cat.transactions.length > 0 ? cat.transactions[0].count : 0
      })) as CategoryWithBudget[],
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Crea o Actualiza una categoría y su presupuesto opcional.
 */
export async function upsertCategoryAction(
  formData: CategoryFormData,
): Promise<CategoryActionResponse> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const categoryPayload = {
      user_id: user.id,
      name: formData.name,
      icon: formData.icon,
      color: formData.color,
      type: formData.type,
    };

    let categoryId = formData.id;

    // 1. Upsert de la Categoría
    if (categoryId) {
      const { error } = await supabase
        .from("categories")
        .update(categoryPayload)
        .eq("id", categoryId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("categories")
        .insert([categoryPayload])
        .select()
        .single();
      if (error) throw error;
      categoryId = data.id;
    }

    // 2. Manejo del Presupuesto (Budgets)
    if (
      formData.type === "expense" &&
      formData.amount_limit !== null &&
      formData.amount_limit !== undefined
    ) {
      const { error: budgetError } = await supabase.from("budgets").upsert(
        {
          user_id: user.id,
          category_id: categoryId,
          amount_limit: formData.amount_limit,
          period: "monthly",
        },
        {
          onConflict: "user_id, category_id, period",
        },
      );

      if (budgetError) throw budgetError;
    } else if (formData.type === "income" || formData.amount_limit === null) {
      await supabase.from("budgets").delete().eq("category_id", categoryId);
    }

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      message: formData.id
        ? "Categoría actualizada"
        : "Categoría creada con éxito",
    };
  } catch (error: any) {
    console.error("Error upsertCategoryAction:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina una categoría pero verifica primero si tiene transacciones.
 */
export async function deleteCategoryAction(
  id: string,
): Promise<CategoryActionResponse> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // 1. Verificar si existen transacciones
    const { count, error: countError } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) throw countError;

    if (count && count > 0) {
      return {
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${count} transacciones asociadas.`,
        count: count,
      };
    }

    // 2. No hay transacciones, procedemos a borrar.
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard/categories");

    return { success: true, message: "Categoría eliminada con éxito" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

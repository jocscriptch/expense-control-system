"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export interface OnboardingStatus {
  hasBudget: boolean;
  hasCategories: boolean;
  hasTransactions: boolean;
  isDismissed: boolean;
  isComplete: boolean;
}

/**
 * Obtiene el estado actual del onboarding del usuario
 * validando sus datos reales en la base de datos.
 */
export async function getOnboardingStatus(): Promise<{
  success: boolean;
  data?: OnboardingStatus;
  error?: string;
}> {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const hasBudget = Number(user.monthly_budget || 0) > 0;
    const isDismissed = Boolean((user as any).onboarding_dismissed);

    // Verificar categorías
    const { count: catCount } = await supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const hasCategories = (catCount ?? 0) > 0;

    // Verificar transacciones
    const { count: txCount } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const hasTransactions = (txCount ?? 0) > 0;

    const isComplete = hasBudget && hasCategories && hasTransactions;

    return {
      success: true,
      data: {
        hasBudget,
        hasCategories,
        hasTransactions,
        isDismissed,
        isComplete,
      },
    };
  } catch (error: any) {
    console.error("Error getOnboardingStatus:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Marca el onboarding como dismissido (el usuario lo cerró manualmente).
 * No borra el progreso, solo oculta el widget.
 */
export async function dismissOnboardingAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
      .from("users")
      .update({ onboarding_dismissed: true, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

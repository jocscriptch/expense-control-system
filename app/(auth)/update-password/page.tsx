import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nueva Contraseña — Sistema de Gastos",
  description: "Ingresa tu nueva contraseña.",
};

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log(`[PAGE-UPDATE-PASSWORD] User: ${user?.email || 'No user'}`);

  // Si no hay sesión, no puede estar aquí
  if (!user) {
    console.log("[PAGE-UPDATE-PASSWORD] Redirecting to /login (No user)");
    redirect("/login");
  }

  return <UpdatePasswordForm />;
}

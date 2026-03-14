"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthResponse, User, SignInData, SignUpData, RecoverData, UpdatePasswordData } from "./types";

// ============ Login ============
export async function login(formData: SignInData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Usuario logueado correctamente", data };
}

// ============ Sign Up ============
export async function signup(formData: SignUpData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Usuario registrado correctamente", data };
}

// ============ Recovery Email ============
export async function sendRecoveryEmail(formData: RecoverData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.resetPasswordForEmail(formData.email);

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.",
    data,
  };
}

// ============ Update Password ============
export async function updatePassword(formData: UpdatePasswordData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Contraseña actualizada correctamente", data };
}

// ============ Get User ============
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user: session },
    } = await supabase.auth.getUser();

    if (!session) return null;

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.id)
      .single();

    if (userError) {
      console.error("Error al obtener el usuario:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
}

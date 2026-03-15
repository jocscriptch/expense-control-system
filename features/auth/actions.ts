"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthResponse, User, SignInData, SignUpData, RecoverData, UpdatePasswordData } from "./types";
import { translateError } from "./utils";

/**
 * Procesa el inicio de sesión de un usuario existente.
 * Utiliza Supabase Auth para validar las credenciales.
 */
export async function login(formData: SignInData): Promise<AuthResponse> {
  const supabase = await createClient();

  // Intentamos iniciar sesión con email y contraseña
  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    // Traducimos el error de Supabase para mostrarlo en español al usuario
    return { success: false, error: translateError(error.message) };
  }

  return { success: true, message: "Usuario logueado correctamente", data };
}

/**
 * Crea un nuevo registro de usuario en el sistema.
 * Implementa una lógica especial de UX para detectar correos duplicados incluso
 * si la protección de enumeración de Supabase está activa.
 */
export async function signup(formData: SignUpData): Promise<AuthResponse> {
  const supabase = await createClient();

  // Registramos al usuario y enviamos metadatos adicionales como el nombre
  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name },
    },
  });

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  /**
   * OPCIÓN UX: Supabase devuelve un objeto de usuario vacío en sus identidades 
   * si el correo ya existe por seguridad. Aquí detectamos eso para dar feedback real.
   */
  if (data.user && data.user.identities?.length === 0) {
    return { 
      success: false, 
      error: "Este correo electrónico ya está registrado." 
    };
  }

  return { success: true, message: "Usuario registrado correctamente", data };
}

/**
 * Envía un correo electrónico para el restablecimiento de contraseña.
 * El flujo continuará a través de la ruta de callback definida en Supabase.
 */
export async function sendRecoveryEmail(formData: RecoverData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.resetPasswordForEmail(formData.email);

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  return {
    success: true,
    message: "Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.",
    data,
  };
}

/**
 * Actualiza la contraseña del usuario actualmente autenticado (normalmente tras recuperar cuenta).
 * Al finalizar, limpia la cookie de seguridad sb-recovery-mode.
 */
export async function updatePassword(formData: UpdatePasswordData): Promise<AuthResponse> {
  const supabase = await createClient();

  // Actualizamos la contraseña en el núcleo de Auth de Supabase
  const { error, data } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  /**
   * SEGURIDAD: Limpiamos la cookie de modo recuperación para que el usuario
   * no pueda volver a entrar a la ruta de actualizar contraseña sin haber solicitado otro correo.
   */
  const cookieStore = await (await import("next/headers")).cookies();
  cookieStore.delete("sb-recovery-mode");

  return { success: true, message: "Contraseña actualizada correctamente", data };
}

/**
 * Cierra la sesión activa del usuario y limpia las cookies de Supabase.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Obtiene el perfil del usuario autenticado cruzando datos de Auth con la tabla 'profiles'.
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    // Obtenemos el ID de la sesión actual
    const {
      data: { user: session },
    } = await supabase.auth.getUser();

    if (!session) return null;

    // Buscamos los metadatos extendidos en nuestra tabla pública de perfiles
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.id)
      .single();

    if (userError) {
      console.error("Error al obtener el perfil de base de datos:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error inesperado al obtener usuario:", error);
    return null;
  }
}

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
 * si la protección de enumeración de Supabase está activa (detecta identidades vacías).
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

  if (data.user && data.user.identities?.length === 0) {
    return { 
      success: false, 
      error: "Este correo electrónico ya está registrado." 
    };
  }

  return { 
    success: true, 
    message: `¡Cuenta creada con éxito! Hemos enviado un correo de confirmación a ${formData.email}. Por favor, verifícalo para continuar.`, 
    data 
  };
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
 * Al finalizar, limpia la cookie de seguridad sb-recovery-mode para evitar reutilización del flujo.
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
 * Verifica si la contraseña actual del usuario es correcta.
 * Se utiliza como paso de seguridad antes de permitir cambiar la contraseña.
 */
export async function verifyCurrentPassword(password: string): Promise<boolean> {
  const supabase = await createClient();
  
  // Obtenemos el correo del usuario actual para la verificación
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return false;

  // Intentamos iniciar sesión con la contraseña actual
  // Esto no afecta la sesión actual si ya está iniciada, solo valida credenciales
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  return !error;
}

/**
 * Obtiene el perfil del usuario autenticado cruzando datos de Auth con la tabla 'users'.
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    
    // Obtenemos el ID de la sesión actual
    const {
      data: { user: session },
      error: sessionError
    } = await supabase.auth.getUser();

    if (!session) {
      return null;
    }

    // Buscamos los metadatos extendidos en nuestra tabla pública de usuarios
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.id)
      .single();

    if (userError) {
      console.error("Error al obtener perfil:", userError.message);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error inesperado en getUser:", error);
    return null;
  }
}

/**
 * Diccionario de traducción: Convierte los mensajes de error técnicos de Supabase 
 * en frases amigables y claras en español para el usuario final.
 */
export function translateError(error: string): string {
  const message = error.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Credenciales inválidas";
  }

  if (message.includes("user already registered")) {
    return "Este correo electrónico ya está registrado.";
  }

  if (message.includes("password should be at least 6 characters")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (message.includes("email not confirmed")) {
    return "Por favor, confirma tu correo electrónico antes de iniciar sesión.";
  }

  if (message.includes("invalid grant")) {
    return "Las credenciales son inválidas o han expirado.";
  }

  // Si no se encuentra una traducción específica, regresamos un mensaje general amigable
  return "Ocurrió un error en la autenticación. Por favor, intenta de nuevo.";
}

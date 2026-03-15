import { z } from "zod";

/**
 * Esquema base para correos electrónicos.
 * Incluye validación de formato, longitud y detección de errores de escritura comunes (typos).
 */
const emailSchema = z
  .string()
  .email("Por favor ingresa un correo válido. Ejemplo: user@mail.com")
  .min(1, { message: "Este campo es requerido" })
  .max(150, { message: "El correo no puede tener más de 150 caracteres" })
  .refine((email) => {
    // Lógica para detectar dominios mal escritos antes de enviar al servidor
    const domain = email.split("@")[1];
    const commonTypos = ["gmai.com", "hotmai.com", "outloo.com", "yaho.com"];
    return !commonTypos.includes(domain?.toLowerCase());
  }, "Parece que hay un error en el dominio (ej. gmai.com). Por favor corrígelo.");

/**
 * Validación para el formulario de Inicio de Sesión.
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),
});

/**
 * Validación para el formulario de Registro.
 * Incluye reglas de complejidad para la contraseña (mayúsculas, minúsculas, caracteres especiales).
 */
export const signUpSchema = z.object({
  name: z
    .string()
    .min(4, "El nombre debe tener al menos 4 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras"
    ),
  email: emailSchema,
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(20, "La contraseña no puede tener más de 20 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
    .regex(/[.,$@]/, "Debe incluir un carácter especial (., $@)"),
});

/**
 * Validación para recuperación de cuenta (solo email).
 */
export const recoverSchema = z.object({
  email: emailSchema,
});

/**
 * Validación para actualización de contraseña.
 * Verifica que ambas contraseñas ingresadas coincidan exactamente.
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(20, "La contraseña no puede tener más de 20 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
      .regex(/[.,$@]/, "Debe incluir un carácter especial (., $@)"),
    confirmPassword: z.string().max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Tipos inferidos de los esquemas para uso en TypeScript
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type RecoverFormValues = z.infer<typeof recoverSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

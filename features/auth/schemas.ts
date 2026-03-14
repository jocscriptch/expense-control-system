import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Por favor ingresa un correo válido. Ejemplo: user@mail.com")
    .min(1, { message: "Este campo es requerido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(4, "El nombre debe tener al menos 4 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras"
    ),
  email: z
    .string()
    .email("Por favor ingresa un correo válido. Ejemplo: user@mail.com")
    .min(1, { message: "Este campo es requerido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const recoverSchema = z.object({
  email: z
    .string()
    .email("Por favor ingresa un correo válido. Ejemplo: user@mail.com")
    .min(1, { message: "Este campo es requerido" }),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Inferred types
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type RecoverFormValues = z.infer<typeof recoverSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

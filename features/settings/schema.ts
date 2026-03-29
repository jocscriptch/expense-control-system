import { z } from "zod";

export const settingsSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100),
    email: z.string().email("Correo electrónico inválido").max(150),
    bio: z.string().max(500).nullable(),
    currency: z.string(),
    language: z.string(),
    theme: z.enum(["light", "dark", "system"]),
    monthly_budget: z.coerce.number().min(0, "El presupuesto debe ser positivo"),
    currentPassword: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .max(20, "La contraseña no puede tener más de 20 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
      .regex(/[.,$@]/, "Debe incluir un carácter especial (., $@)")
      .or(z.literal(""))
      .optional(),
    confirmPassword: z.string().max(20).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    {
      message: "La contraseña debe tener al menos 6 caracteres",
      path: ["password"],
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const hasCurrent =
        data.currentPassword && data.currentPassword.length > 0;
      const hasNew = data.password && data.password.length > 0;
      const hasConfirm =
        data.confirmPassword && data.confirmPassword.length > 0;

      if (hasCurrent || hasNew || hasConfirm) {
        return !!(hasCurrent && hasNew && hasConfirm);
      }
      return true;
    },
    {
      message:
        "Debes completar los tres campos de seguridad para cambiar tu clave",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.password && data.currentPassword) {
        return data.password !== data.currentPassword;
      }
      return true;
    },
    {
      message: "La nueva contraseña debe ser diferente a la actual",
      path: ["password"],
    },
  );

export type SettingsFormData = z.infer<typeof settingsSchema>;

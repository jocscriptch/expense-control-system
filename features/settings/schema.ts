import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Correo electrónico inválido").max(150),
  bio: z.string().max(500).nullable(),
  currency: z.string(),
  language: z.string(),
  theme: z.enum(["light", "dark", "system"]),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

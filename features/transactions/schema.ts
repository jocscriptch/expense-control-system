import { z } from "zod";

/**
 * Esquema de validación para el registro de transacciones (Gastos/Ingresos).
 * Sigue el estándar de la tabla 'transactions' en database.sql
 */
export const transactionSchema = z.object({
  amount: z
    .number({ message: "El monto es obligatorio" })
    .positive("El monto debe ser superior a cero"),
  category_id: z
    .string({ message: "La categoría es obligatoria" })
    .uuid("Categoría no válida"),
  date: z.string({ message: "La fecha es obligatoria" }),
  payment_method: z.enum(["cash", "card", "sinpe"], {
    message: "El método de pago es obligatorio",
  }),
  description: z.string().optional(),
  is_recurring: z.boolean().default(false),
  is_household: z.boolean().default(false),
  is_shared: z.boolean().default(false),
  attachment_url: z.string().url().optional().or(z.literal("")),
  file: z.any().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

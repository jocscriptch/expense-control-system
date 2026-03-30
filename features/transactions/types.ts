/**
 * Representación de una Categoría desde la base de datos
 */
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: "expense" | "income";
}

/**
 * Transacción enriquecida con datos de su categoría (resultado del JOIN)
 */
export interface TransactionWithCategory {
  id: string;
  user_id: string;
  category_id?: string;
  amount: number;
  date: string;
  description?: string;
  payment_method: "cash" | "card" | "sinpe";
  is_recurring: boolean;
  is_household: boolean;
  is_shared: boolean;
  attachment_url?: string | null;
  created_at: string;
  category?: Category | null;
}

/**
 * Representación de una Transacción completa (incluyendo metadatos)
 */
export interface Transaction {
  id: string;
  user_id: string;
  category_id?: string;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  payment_method: "cash" | "card" | "sinpe";
  is_recurring: boolean;
  is_household: boolean;
  is_shared: boolean;
  attachment_url?: string;
  created_at: string;
}

/**
 * Respuesta estandarizada para acciones de servidor de transacciones
 */
export interface TransactionResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

import { Category as BaseCategory } from "@/features/transactions/types";

export interface CategoryWithBudget extends BaseCategory {
  budget?: {
    id: string;
    amount_limit: number;
    period: string;
  } | null;
}

export interface CategoryActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  count?: number;
}

export interface CategoryFormData {
  id?: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
  amount_limit?: number | null;
}

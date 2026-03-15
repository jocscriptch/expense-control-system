// ============ User Domain ============
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  country_code: string | null;
  phone: string | null;
  bio: string | null;
  currency: string | null;
  language: string | null;
  theme: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Auth Responses ============
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

// ============ Form Data ============
export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface RecoverData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
}

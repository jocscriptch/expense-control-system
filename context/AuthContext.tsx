"use client";

import { getUser } from "@/features/auth/actions";
import type { User } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useTheme } from "next-themes";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ============ Provider ============
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();

  /**
   * useCallback evita que la referencia de la función cambie en cada render,
   * lo cual es importante al pasarla como dependencia o prop.
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error(
        "AuthContext: Error al actualizar datos del usuario:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await refreshUser();
      } else {
        setIsLoading(false);
      }
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const listenedEvents = [
        "SIGNED_IN",
        "USER_UPDATED",
        "TOKEN_REFRESHED",
        "SIGNED_OUT",
      ];

      if (event === "INITIAL_SESSION") return;
      if (!listenedEvents.includes(event)) return;

      if (session) {
        refreshUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  /**
   * Sincronización de Temas con next-themes
   * Asegura que la preferencia del usuario en la BD se refleje en el sistema estándar.
   */
  useEffect(() => {
    if (!isLoading && user) {
      setTheme(user.theme || "system");
    }
  }, [user?.theme, isLoading, setTheme]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
};

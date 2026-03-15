import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Factory para crear el cliente de Supabase en el lado del servidor (Server Components/Actions).
 * Maneja automáticamente la persistencia de sesión a través de cookies de Next.js.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            /**
             * Nota: setAll solo funciona en Server Actions o Route Handlers.
             * Si se llama desde un Server Component normal, Next.js lanzará un error
             * que aquí ignoramos porque el Middleware se encarga del refresco.
             */
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silenciamos el error esperado en Server Components
          }
        },
      },
    }
  );
}

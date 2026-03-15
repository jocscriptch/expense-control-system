import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de sesión: Actualiza la cookie de sesión de Supabase y maneja la protección de rutas.
 * Este archivo centraliza la lógica de redirección basada en el estado de autenticación.
 */
export async function updateSession(request: NextRequest) {
  // Inicializamos la respuesta por defecto
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Creamos el cliente de Supabase específico para SSR/Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Actualizamos tanto la request como la response para mantener las cookies sincronizadas
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  /**
   * SEGURIDAD: getUser() es vital aquí para verificar la integridad de la sesión en el servidor.
   * No uses getSession() en el middleware ya que es menos seguro.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  
  // Debug log para desarrollo (puedes comentarlo si el terminal se llena mucho)
  console.log(`[PROXY] Path: ${path}, User: ${user?.email || 'No user'}`);

  // Clasificación de rutas: Páginas que solo deben ver usuarios NO logueados
  const isAuthPage =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path.startsWith("/login/") ||
    path.startsWith("/register/") ||
    path.startsWith("/forgot-password/");

  // Clasificación de rutas: Páginas que requieren autenticación obligatoria
  const isDashboardPage = 
    path === "/dashboard" || 
    path.startsWith("/dashboard/") ||
    path === "/update-password" ||
    path.startsWith("/update-password/");

  // REGLA 1: Si no hay usuario e intenta entrar a un área privada -> Al Login
  if (!user && isDashboardPage) {
    console.log(`[PROXY] Redirecting to /login (Unauthenticated at ${path})`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**
   * REGLA 2: Protección extra para /update-password.
   * Solo dejamos pasar si el usuario tiene la cookie 'sb-recovery-mode'.
   * Esto evita que un usuario logueado normalmente entre a "resetear" clave sin permiso.
   */
  if (path.startsWith("/update-password")) {
    const hasRecoveryCookie = request.cookies.has("sb-recovery-mode");
    if (user && !hasRecoveryCookie) {
      console.log(`[PROXY] Redirecting to /dashboard (Authenticated but no recovery cookie at ${path})`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // REGLA 3: Si ya está logueado e intenta ir a páginas de Auth -> Al Dashboard
  if (user && isAuthPage) {
    console.log(`[PROXY] Redirecting to /dashboard (Authenticated at ${path})`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

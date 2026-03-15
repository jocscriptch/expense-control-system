import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Endpoint de Callback: Supabase redirige aquí tras confirmar email o recuperación.
 * Este archivo intercambia el 'token_hash' por una sesión real en el servidor.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();

    // Verificamos el token (OTP) con el núcleo de Supabase
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      /**
       * CASO ESPECIAL: Recuperación de contraseña.
       * Si el usuario viene de recuperar cuenta, le ponemos una cookie de seguridad
       * para permitirle entrar a la página de /update-password.
       */
      if (type === "recovery") {
        const response = NextResponse.redirect(`${origin}/update-password`);
        
        response.cookies.set("sb-recovery-mode", "true", {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 600, // La sesión de "intento" dura 10 minutos
        });
        
        return response;
      }

      // Por defecto, redirigir al Dashboard o a la página solicitada original
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si algo falla, lo enviamos al login con un parámetro de error
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * ARCHIVO CRÍTICO: Este es el proxy (middleware) de Next.js 16.
 * Next.js 16 ha deprecado 'middleware.ts' a favor de 'proxy.ts' a nivel de raíz.
 * Aquí simplemente delegamos la lógica de sesión a nuestra librería de Supabase.
 */
export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas de la aplicación excepto archivos estáticos.
         * Esto asegura que el estado de la sesión se verifique en cada navegación.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

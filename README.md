# Sistema de Control de Gastos 💰

Un sistema moderno y premium para la gestión de presupuestos familiares, diseñado para ofrecer una experiencia visual impactante y un control financiero inteligente.

## 🚀 Tecnologías

- **Framework:** Next.js 16.1.6 (Turbopack)
- **Autenticación:** Supabase Auth (Google & Email/Password)
- **Estilos:** Tailwind CSS (Vanilla)
- **Formularios:** React Hook Form + Zod
- **Arquitectura:** Clean Architecture Hexagonal Lite

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura organizada por **Slices Verticales** para facilitar el mantenimiento y la escalabilidad:

- 📂 `app/`: Rutas, layouts y configuración de Next.js (App Router).
- 📂 `features/`: Lógica de negocio segmentada por dominio (ej. `auth`). Contiene actions, schemas y tipos.
- 📂 `components/`:
  - `auth/`: Componentes específicos de autenticación (Login, Registro, etc.).
  - `ui/`: Componentes base reutilizables (Button, Input, FormField).
- 📂 `lib/`: Configuraciones de infraestructura (Supabase client/server).
- 📂 `public/`: Assets estáticos y assets de marca.

## 🎨 Diseño (Stitch Theme)

El sistema utiliza una estética de alto contraste con una paleta de colores **Verde Bosque Profundo (`#0a1b12`)** y **Verde Primario Vibrante (`#13ec5b`)**.

- **Layout Split-Screen:** Diseño dividido para páginas de autenticación.
- **Micro-animaciones:** Transiciones suaves y efectos de hover premium.
- **Identidad Visual:** Tipografía Inter para máxima legibilidad.

## 🛠️ Instalación y Uso

1. Instala las dependencias:
   ```bash
   pnpm install
   ```

2. Configura las variables de entorno en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

## 🔒 Seguridad
Las rutas están protegidas mediante la nueva convención de Next.js 16 utilizando `proxy.ts`, asegurando una validación robusta de sesiones tanto en cliente como en servidor.


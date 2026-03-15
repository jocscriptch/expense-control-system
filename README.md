# Sistema de Control de Gastos 💰

Un sistema moderno y premium para la gestión de presupuestos familiares, diseñado para ofrecer una experiencia visual impactante y un control financiero inteligente.

## 🚀 Tecnologías

- **Framework:** [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **Autenticación:** [Supabase Auth](https://supabase.com/auth)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Validación:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)

---

## 💡 Conceptos Clave

Para entender este proyecto, es importante conocer dos piezas fundamentales de su arquitectura:

### 1. ¿Qué es Supabase?
**Supabase** es nuestra infraestructura de backend (Backend-as-a-Service). En lugar de crear un servidor desde cero para la base de datos y la seguridad, usamos Supabase para:
- **Base de Datos (PostgreSQL):** Donde se guardan tus gastos y perfil.
- **Autenticación:** Maneja el inicio de sesión, el registro y la recuperación de contraseñas de forma segura.
- **Seguridad:** Nos permite definir quién puede ver qué datos mediante políticas.

### 2. ¿Qué son las Server Actions?
Las **Server Actions** son funciones especiales de Next.js que nos permiten enviar datos del formulario directamente a la base de datos sin necesidad de crear una "API" tradicional.
- **Cómo funcionan:** Cuando haces clic en "Guardar", se ejecuta una función que tiene el marcador `"use server"` en la parte superior.
- **Simplicidad:** Esto hace que el código sea más rápido de escribir y más seguro, ya que la lógica de las contraseñas y llaves secretas nunca sale del servidor hacia el navegador del usuario.

---

## 🛠️ Guía de Instalación y Configuración

Sigue estos pasos para configurar el proyecto en tu entorno local.

### 1. Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- **Node.js:** Versión 20.x o superior (LTS recomendada).
  - [Descargar Node.js](https://nodejs.org/)
- **pnpm:** Utilizado como gestor de paquetes (más rápido que npm).
  - Para instalarlo globalmente: `npm install -g pnpm`

### 2. Clonar el Proyecto

Si aún no tienes el código, clona el repositorio:

```bash
git clone https://github.com/jocscriptch/expense-control-system.git
cd sistema-control-gastos
```

### 3. Instalar Dependencias

Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
```

### 4. Variables de Entorno

El proyecto requiere conexión con Supabase. Crea un archivo llamado `.env.local` en la raíz del proyecto:

1. Duplica el ejemplo:
   ```bash
   cp .env.example .env.local
   ```
2. Abre `.env.local` y coloca tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-anon-key
   ```

### 5. Iniciar el Servidor de Desarrollo

Una vez configurado todo, lanza la aplicación:

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura organizada por **Slices Verticales** (Dominios):

- 📂 `app/`: Routing de Next.js, Layouts globales y páginas.
- 📂 `features/`: Lógica de negocio (aquí están las **Server Actions**).
- 📂 `components/`:
  - `auth/`: Componentes específicos del flujo de login y registro.
  - `ui/`: Componentes base reutilizables.
- 📂 `lib/`: Lógica de infraestructura (Configuración de Supabase).

---

## 🔒 Seguridad
Las rutas están protegidas mediante la nueva convención de Next.js 16 utilizando `proxy.ts` (Middleware), asegurando una validación robusta de sesiones tanto en cliente como en servidor.

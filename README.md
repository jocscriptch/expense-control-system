# 💰 Sistema de Control de Gastos

Un ecosistema financiero personal diseñado para ofrecer **claridad, control y empoderamiento** sobre tus finanzas. Este sistema no es solo un registrador de gastos; es una herramienta inteligente que te ayuda a definir metas, organizar categorías y visualizar tu salud financiera en tiempo real con una experiencia de usuario de primer nivel.

---

## 🖼️ Vista General del Sistema

<img width="1475" height="720" alt="sistema gastos" src="https://github.com/user-attachments/assets/034f5e6a-9f2d-4b43-adc5-ad2615b59f5a" />

---

## 🎯 ¿Qué busca resolver este proyecto?

La gestión financiera suele ser tediosa y difícil de seguir. Este proyecto nace para resolver la falta de visibilidad en el gasto diario a través de:

- **Establecimiento de Metas**: Define un presupuesto mensual y monitorea tu progreso.
- **Categorización Inteligente**: Clasifica tus gastos para saber exactamente a dónde se va tu dinero.
- **Onboarding Guiado**: Un sistema que te acompaña paso a paso desde que te registras hasta que dominas la herramienta.
- **Diseño Adaptable**: Una interfaz premium que luce increíble tanto en modo claro como en modo oscuro.

---

## 🏗️ Arquitectura y Filosofía de Código

Este proyecto ha sido construido siguiendo los principios de **Clean Code** y una **Arquitectura Limpia basada en Features (Vertical Slices)**.

### 🧩 Estructura General

En lugar de organizar el código por tipo de archivo (componentes, hooks, acciones), lo organizamos por **funcionalidades**:

- **`features/auth`**: Todo lo relacionado con seguridad y sesiones.
- **`features/transactions`**: Core de la lógica de gastos y registros.
- **`features/categories`**: Gestión y personalización de categorías.
- **`features/onboarding`**: El flujo de bienvenida y tours guiados.
- **`features/settings`**: Configuración de perfil, moneda y presupuestos.

### 🚀 Rendimiento Moderno (SSR & Server Actions)

- **Renderizado del Lado del Servidor (SSR)**: La aplicación genera las páginas en el servidor. Esto significa que cuando entras, la información ya viene lista, mejorando la velocidad percibida y el posicionamiento.
- **Server Actions**: Utilizamos la tecnología más moderna de Next.js para enviar datos. No hay APIs intermediarias lentas; las acciones se ejecutan directamente en el servidor, garantizando seguridad y una respuesta instantánea al usuario.

---

## 🛠️ Tecnologías Utilizadas

| Capa              | Tecnología                                                                |
| :---------------- | :------------------------------------------------------------------------ |
| **Framework**     | [Next.js 16](https://nextjs.org/) (App Router)                            |
| **Base de Datos** | [Supabase](https://supabase.com/) (PostgreSQL)                            |
| **Estilos**       | [Tailwind CSS v4](https://tailwindcss.com/) (Modern CSS)                  |
| **Animaciones**   | [Framer Motion](https://www.framer.com/motion/)                           |
| **Formularios**   | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Tours Guiados** | [Driver.js](https://driverjs.com/)                                        |
| **Gráficos**      | [Recharts](https://recharts.org/)                                         |

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para tener el sistema corriendo en tu computadora en menos de 5 minutos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/jocscriptch/expense-control-system.git
cd sistema-control-gastos
```

### 2. Instalar dependencias

Recomendamos usar `pnpm` por su velocidad:

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` y añade tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-anon-key
```

### 4. Ejecutar el proyecto

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el sistema en acción.

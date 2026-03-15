# Guía de Desarrollo y Arquitectura

Este documento explica cómo está estructurado el proyecto, cómo funciona el enrutamiento (App Router) y cuáles son los pasos estándar para crear nuevas funcionalidades, páginas y Server Actions.

---

## 🏗️ 1. Arquitectura del Proyecto (Estructura de Carpetas)

El proyecto utiliza un enfoque híbrido entre las convenciones de **Next.js App Router** y una arquitectura orientada a características (**Feature-Sliced Design**).

```text
sistema-control-gastos/
├── app/                  # Rutas, Páginas y Layouts (Next.js App Router)
│   ├── (auth)/           # Grupo de rutas de autenticación (login, register)
│   ├── (app)/            # Grupo de rutas de la aplicación principal (dashboard)
│   └── api/              # Rutas de API (Route Handlers)
├── features/             # Lógica de negocio agrupada por funcionalidad
│   ├── auth/             # Ej: Todo lo relacionado a autenticación
│   │   ├── actions.ts    # Server Actions (Interacción con BD)
│   │   ├── components/   # Componentes UI específicos de la feature
│   │   ├── schema.ts     # Validaciones con Zod
│   │   └── types.ts      # Interfaces TypeScript
│   └── settings/         # Ej: Ajustes del perfil del usuario
├── components/           # Componentes compartidos y UI genérica
│   ├── ui/               # Botones, Inputs, Spinners, etc.
│   └── dashboard/        # Componentes estructurales (Sidebar, Header)
├── context/              # Gestores de estado global (AuthContext)
└── lib/                  # Utilidades y configuración compartida (Supabase, helpers)
```

---

## 🚦 2. Enrutamiento y Páginas (App Router)

El directorio `app/` maneja todas las rutas de la aplicación usando el sistema basado en carpetas de Next.js.

### Grupos de Rutas `(nombre)`
Las carpetas entre paréntesis, como `(auth)` o `(app)`, **no afectan la URL**. Sirven para agrupar páginas que comparten un mismo `layout.tsx` (estructura visual).
-   `app/(auth)/login/page.tsx` responde a la ruta `/login`.
-   `app/(app)/dashboard/page.tsx` responde a la ruta `/dashboard`.

### ¿Cómo crear una nueva página?
Si quieres añadir una página para mostrar las categorías (`/dashboard/categories`):
1.  Crea la carpeta: `app/(app)/dashboard/categories/`
2.  Crea el archivo `page.tsx` dentro de esa carpeta:

```tsx
// app/(app)/dashboard/categories/page.tsx
export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-main">Categorías</h1>
      {/* Contenido de la página */}
    </div>
  );
}
```

---

## ⚡ 3. Server Actions (Interacción con la Base de Datos)

Usamos **Server Actions** para comunicarnos con Supabase de forma segura desde el servidor, sin necesidad de crear endpoints de API (Route Handlers) manuales.

Las acciones se agrupan en archivos `actions.ts` dentro de su respectiva carpeta en `features/`.

### Estándar para crear una Server Action
Toda acción debe devolver un objeto estándar con la respuesta: `{ success: boolean, data?: any, error?: string, message?: string }`.

```typescript
// features/categories/actions.ts
"use server"; // Obligatorio al inicio del archivo

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string, type: 'income' | 'expense') {
  const supabase = await createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, type, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Refrescar los datos en pantalla después de crear
    revalidatePath("/dashboard/categories");

    return { success: true, data, message: "Categoría creada" };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear" };
  }
}
```

---

## 🧩 4. Pasos para crear una Nueva Funcionalidad (Ej: "Categorías")

Para mantener el código limpio y mantenible, sigue este orden al crear una funcionalidad nueva:

### Paso 1: Types y Validaciones (`features/categories/types.ts` y `schema.ts`)
Define cómo lucen los datos y cómo se validarán los formularios (usando Zod).
```typescript
// types.ts
export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}
```

### Paso 2: Server Actions (`features/categories/actions.ts`)
Crea las funciones de lectura (GET), creación (POST), actualización (PUT) y borrado (DELETE) interactuando con Supabase. Asegúrate de incluir la directiva `"use server"`.

### Paso 3: Componentes y Formularios (`features/categories/components/`)
Crea los formularios usando `react-hook-form` y los componentes UI necesarios (tablas, tarjetas). Aquí es donde llamas a las acciones de servidor que creaste en el paso anterior.
```tsx
"use client"; // Importante para componentes que usan hooks (useState, useForm)
import { createCategory } from "../actions";

export function CategoryForm() {
  // Configuración del formulario y llamada a createCategory()
}
```

### Paso 4: La Página (`app/(app)/dashboard/categories/page.tsx`)
Finalmente, junta tus componentes en la página. Si la página es asíncrona (Server Component), puedes cargar los datos iniciales directamente sin usar `useEffect`.

```tsx
import { getCategories } from "@/features/categories/actions";
import { CategoryList } from "@/features/categories/components/CategoryList";

export default async function CategoriesPage() {
  // Carga de datos directamente en el servidor
  const initialData = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">Mis Categorías</h1>
      <CategoryList initialCategories={initialData.data} />
    </div>
  );
}
```

---

## 🎨 5. Componentes UI Reutilizables

Si estás construyendo un componente que no pertenece a una característica específica (ej. un modal genérico, un dropdown estilizado), ubícalo en `components/ui/` y aségurate de aplicar la [Guía de Tema Oscuro](./theme-guidelines.md).

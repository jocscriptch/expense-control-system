# Estándares de Codificación y Arquitectura Limpia

Este documento establece las guías y mejores prácticas para el desarrollo del **Sistema de Control de Gastos**. El objetivo es mantener una base de código coherente, escalable y fácil de mantener separando estrictamente la interfaz de usuario de la lógica de negocio.

---

## 1. Arquitectura de Referencia

Seguimos una **Arquitectura en Capas (Clean Architecture)** adaptada a Next.js:

1.  **Capa de Presentación (UI)**: Componentes de React (`components/`, `app/`). Su única responsabilidad es renderizar datos y capturar eventos del usuario. **No deben contener lógica de negocio compleja ni fetch directos.**
2.  **Capa de Aplicación (Hooks)**: Hooks personalizados (`hooks/`, `features/*/hooks/`). Orquestan el estado, llaman a Server Actions y manejan efectos secundarios. Son el puente entre la UI y el Servidor.
3.  **Capa de Dominio (Schemas & Types)**: Definiciones de datos (`features/*/schemas.ts`, `types/`). Usamos **Zod** para validación en tiempo de ejecución y TypeScript para seguridad en desarrollo.
4.  **Capa de Infraestructura (Actions)**: Server Actions (`features/*/actions.ts`). Lógica que se ejecuta en el servidor, interactúa con la base de datos (Supabase) y devuelve resultados estandarizados.

---

## 2. Estandarización de Formularios

Para todos los formularios del sistema, es obligatorio usar el hook centralizado `useFormAction`.

### Ventajas:
- Validación automática con Zod.
- Manejo centralizado de estados de carga (`isLoading`).
- Notificaciones Toast automáticas (Éxito/Error).
- Reducción de boilerplate en un 60%.

### Ejemplo de uso:
```tsx
const { control, onSubmit, isLoading } = useFormAction({
  schema: miEsquemaZod,
  action: miServerAction,
  defaultValues: { ... },
  loadingMessage: "Procesando...",
  onSuccess: (result) => { /* lógica post-éxito */ }
});
```

---

## 3. Fragmentación de Componentes

Para evitar archivos monoliticos de más de 200 líneas (como el antiguo `SettingsForm`):

- **Regla del 200**: Si un componente supera las 200 líneas o maneja más de 3 sub-secciones lógicas, debe fragmentarse.
- **Estructura de Carpeta**:
  - `FeatureName/components/MainForm.tsx` (Shell)
  - `FeatureName/components/SubSectionA.tsx`
  - `FeatureName/hooks/useFeatureLogic.ts`
  - `FeatureName/actions.ts`

---

## 4. Manejo de Errores y Estados

1.  **Server Actions**: Siempre deben retornar un objeto con `{ success: boolean, data?: T, error?: string, message?: string }`. **Nunca** deben lanzar excepciones que lleguen al cliente sin capturar.
2.  **Loading**: Usar el estado `isLoading` provisto por los hooks para deshabilitar botones y mostrar esqueletos (`Skeleton`) o spinners (`Loader2`).
3.  **Notificaciones**: Usar `react-hot-toast` para feedback inmediato.

---

## 5. Mejores Prácticas Generales

- **Iconografía**: Priorizar `Lucide React` para consistencia. Usar `Material Symbols` solo cuando sea estrictamente necesario para el diseño de la marca.
- **Tipado**: Evitar el uso de `any`. Si una librería externa lo requiere temporalmente tras un refactor, marcarlo con `// TODO: Fix type`.
- **Estilos**: Usar Vanilla CSS o clases de utilidad coherentes. Mantener los temas (Dark/Light) mediante variables de CSS raíz.
- **Imágenes**: Optimizar siempre en el cliente antes de subir al servidor (usar `processImage` en `lib/utils/image.ts`).

---

> [!IMPORTANT]
> Todo nuevo desarrollo debe ser auditado contra este estándar antes de ser integrado. La coherencia es más importante que la velocidad de entrega.

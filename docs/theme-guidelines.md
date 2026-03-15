# Guía de Estilos y Tematización (Claro/Oscuro)

Para garantizar que todos los nuevos componentes, páginas y módulos de la aplicación se adapten automáticamente al modo oscuro (Dark Mode) sin necesidad de hacer retrabajo ni usar clases específicas que fuercen colores (`dark:bg-slate-900`, `bg-white`, `text-black`), debes utilizar **estrictamente los Design Tokens (variables de Tailwind)** definidos en `globals.css`.

El sistema de temas usa `next-themes` y determina el color en tiempo real basado en estas variables.

## 🚫 Qué NO hacer (Anti-patrones)
Nunca uses colores hardcodeados de la paleta estándar de Tailwind para fondos y textos principales, ni dependas del prefijo `dark:`.

❌ **Incorrecto:**
```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
  <h2 className="text-gray-900 dark:text-white">Título</h2>
  <p className="text-gray-500 dark:text-gray-400">Descripción</p>
</div>
```

## ✅ Qué SÍ hacer (Mejores Prácticas)
Utiliza siempre nuestras variables semánticas.

✅ **Correcto:**
```tsx
<div className="bg-surface border border-border">
  <h2 className="text-text-main">Título</h2>
  <p className="text-text-sub">Descripción</p>
</div>
```

---

## Diccionario de Variables Disponibles

### 1. Fondos (Backgrounds & Surfaces)
El color de fondo define el canvas principal y las tarjetas que van sobre él.

| Clase Tailwind | Uso principal | Color Claro | Color Oscuro |
| :--- | :--- | :--- | :--- |
| `bg-background` | Fondo principal de la app (el de más al fondo). | Gris muy tenue (`#f8fcf9`) | Verde muy oscuro (`#102216`) |
| `bg-surface` | Fondo para tarjetas, modales, formularios y elementos elevados. | Blanco (`#ffffff`) | Verde oscuro (`#1a2c20`) |
| `bg-surface-hover` | Usado para efectos hover sobre cards o listas. | Gris claro (`#f1f5f9`) | Blanco transparente (`rgba(255,255,255,0.05)`) |

### 2. Bordes y Divisores (Borders)
Para separar secciones, botones out-lined o contornos de tarjetas.

| Clase Tailwind | Uso principal | Color Claro | Color Oscuro |
| :--- | :--- | :--- | :--- |
| `border-border` | Bordes estándar de tarjetas e inputs. | Gris pálido (`#f1f5f9`) | Blanco tenue (`rgba(255,255,255,0.1)`) |
| `border-border-hover` | Bordes al hacer hover (inputs enfocados o botones). | Gris un poco oscuro | Blanco más sólido |

### 3. Textos e Iconos (Typography)
Los textos deben asegurar contraste en ambos modos.

| Clase Tailwind | Uso principal | Color Claro | Color Oscuro |
| :--- | :--- | :--- | :--- |
| `text-text-main` | Títulos, textos primarios e inputs y etiquetas. | Negro (`#0d1b12`) | Blanco/Off-white (`#f1f5f2`) |
| `text-text-sub` | Párrafos descriptivos, placeholders, u opciones secundarias. | Gris azulado (`#64748b`)| Verde pastel (`#88b394`) |
| `text-text-dim` | Textos minúsculos muy opacos, iconos inactivos. | Gris claro (`#94a3b8`) | Verde oscuro/opaco (`#648a6e`) |

### 4. Primarios (Acentos)
La marca de la aplicación no cambia radicalmente, solo se adapta si es necesario un contraste.

| Clase Tailwind | Uso principal |
| :--- | :--- |
| `bg-primary`, `text-primary` | Botones principales, acentos (`#13ec5b`). |
| `bg-primary-hover` | Hover del botón primario (`#0fd650`). |
| `text-primary-foreground` | Texto oscuro dentro de botones primarios (`#0d1b12`). |

---

## Excepciones (Páginas Estáticas)
Hay ciertas páginas donde esta regla no aplica porque su diseño está destinado a ser fijo para proteger la marca corporativa en el primer vistazo:

1. **Vistas Locales de Autenticación (`(auth)/login`, `register`, etc.)**: Aquí usamos explícitamente colores de la paleta corporativa estricta (`#0a1b12`, `bg-white`) ya que ignoran el tema global de manera deliberada.
2. **Página de Error 404**: Por diseño, se acordó mantener un esquema pálido fijo usando explícitamente `bg-slate-50` y `bg-white` para que se distinga de la app.

Para todo lo que viva dentro de `(app)/dashboard/*` **es obligatorio seguir este documento.**

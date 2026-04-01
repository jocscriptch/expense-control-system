import type { DriveStep } from "driver.js";

/**
 * Tour "Guíame" para configurar la meta mensual.
 * Lleva al usuario a la sección de Ajustes y resalta el campo de presupuesto.
 */
export const budgetTourSteps: DriveStep[] = [
  {
    element: "#sidebar-nav-settings",
    popover: {
      title: "⚙️ Ajustes de cuenta",
      description:
        "Aquí encontrarás todas las configuraciones de tu cuenta. Vamos a entrar para definir tu meta mensual.",
      side:
        typeof window !== "undefined" && window.innerWidth < 1024
          ? "bottom"
          : "right",
      align: "start",
    },
    onHighlightStarted: () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const burger = document.getElementById("mobile-burger-button");
        const sidebar = document.getElementById("mobile-sidebar");
        if (
          burger &&
          sidebar &&
          sidebar.classList.contains("-translate-x-full")
        ) {
          burger.click();
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 400);
        }
      }
    },
  },
];

export const budgetOnSettingsTourSteps: DriveStep[] = [
  {
    element: "#settings-monthly-budget",
    popover: {
      title: "🎯 Tu Meta Mensual",
      description:
        "Ingresa aquí cuánto esperas gastar como máximo en el mes. El dashboard usará este número para mostrarte qué tan cerca estás de tu límite.",
      side:
        typeof window !== "undefined" && window.innerWidth < 768
          ? "bottom"
          : "bottom",
      align: "start",
    },
  },
  {
    element: "#settings-save-button",
    popover: {
      title: "💾 Guardar cambios",
      description:
        "Haz clic aquí para guardar tu meta. Una vez guardado, el paso se marcará como completado en tu Dashboard.",
      side: "top",
      align: "center",
    },
  },
];

export const categoryTourSteps: DriveStep[] = [
  {
    element: "#sidebar-nav-categories",
    popover: {
      title: "🏷️ Categorías",
      description:
        "Las categorías son clave para organizar tus gastos. Crea una para cada tipo de gasto que tengas: Alimentación, Transporte, Entretenimiento...",
      side:
        typeof window !== "undefined" && window.innerWidth < 1024
          ? "bottom"
          : "right",
      align: "start",
    },
    onHighlightStarted: () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const burger = document.getElementById("mobile-burger-button");
        const sidebar = document.getElementById("mobile-sidebar");
        if (
          burger &&
          sidebar &&
          sidebar.classList.contains("-translate-x-full")
        ) {
          burger.click();
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 400);
        }
      }
    },
  },
];

export const categoryOnPageTourSteps: DriveStep[] = [
  {
    element: "#btn-new-category",
    popover: {
      title: "➕ Nueva Categoría",
      description:
        "Presiona este botón para crear tu primera categoría. Al terminar de crearla, podrás volver al Dashboard.",
      side: "bottom",
      align: "start",
    },
  },
];

export const transactionTourSteps: DriveStep[] = [
  {
    element: "#btn-new-transaction",
    popover: {
      title: "✅ ¡Ya estás listo!",
      description:
        "Haz clic en este botón para registrar tu primer gasto. Verás cómo el dashboard y los gráficos comienzan a mostrar información en tiempo real.",
      side: "bottom",
      align: "end",
    },
  },
];

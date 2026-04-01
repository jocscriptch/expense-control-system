"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  budgetOnSettingsTourSteps,
  categoryOnPageTourSteps,
} from "../lib/tours";

/**
 * Componente que verifica si hay un tour pendiente después de una navegación
 * y lo inicia en la página correspondiente.
 *
 * FIX: Aumentado el delay y la robustez para evitar fallos en Modo Oscuro.
 */
export function TourAutoStarter() {
  const pathname = usePathname();

  useEffect(() => {
    // Si estamos en móvil, el flujo es nativo (OnboardingHighlight)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return;
    }

    const activeTour = sessionStorage.getItem("active_onboarding_tour");
    if (!activeTour) return;

    let steps = null;

    if (activeTour === "budget" && pathname === "/dashboard/settings") {
      steps = budgetOnSettingsTourSteps;
    } else if (
      activeTour === "categories" &&
      pathname === "/dashboard/categories"
    ) {
      steps = categoryOnPageTourSteps;
    }

    if (steps) {
      const timer = setTimeout(() => {
        const targetSelector = steps[0].element as string;

        let attempts = 0;
        const checkAndStart = () => {
          const el = document.querySelector(targetSelector);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
              const driverObj = driver({
                showProgress: false,
                animate: true,
                overlayColor: "rgba(0,0,0,0.85)",
                popoverClass: "onboarding-popover",
                nextBtnText: "Siguiente",
                prevBtnText: "Anterior",
                doneBtnText: "¡Entendido!",
                stagePadding: 10,
                disableActiveInteraction: false,
                steps: steps,
                onDestroyStarted: () => {
                  driverObj.destroy();
                },
              });
              driverObj.drive();
              sessionStorage.removeItem("active_onboarding_tour");
            }, 300);
          } else if (attempts < 5) {
            attempts++;
            setTimeout(checkAndStart, 500);
          }
        };

        checkAndStart();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}

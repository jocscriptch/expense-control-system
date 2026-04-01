import { driver, Config } from "driver.js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Configuración base para todos los tours de onboarding.
 * Garantiza consistencia visual y de comportamiento.
 */
const BASE_DRIVER_CONFIG: Config = {
  showProgress: false,
  animate: true,
  overlayColor: "rgba(0,0,0,0.85)",
  popoverClass: "onboarding-popover",
  nextBtnText: "Siguiente",
  prevBtnText: "Anterior",
  disableActiveInteraction: false,
};

/**
 * Helper para iniciar un tour de navegación (Settings/Categories).
 * Maneja tanto el click en 'Siguiente' como el click en 'Hecho' para navegar.
 */
export const startNavigationTour = (
  steps: any[],
  router: AppRouterInstance,
  targetPath: string,
  sessionKey: string,
  doneBtnText: string,
) => {
  const handleNavigation = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const overlay = document.getElementById("mobile-sidebar-overlay");
      if (overlay) overlay.click();
    }
    sessionStorage.setItem("active_onboarding_tour", sessionKey);
    router.push(`${targetPath}?onboarding=true`);
  };

  const driverObj = driver({
    ...BASE_DRIVER_CONFIG,
    doneBtnText,
    onNextClick: () => {
      if (driverObj.isLastStep()) {
        handleNavigation();
        driverObj.destroy();
      } else {
        driverObj.moveNext();
      }
    },
    onDestroyStarted: () => {
      if (driverObj.isLastStep()) {
        handleNavigation();
      }
      driverObj.destroy();
    },
    steps,
  });

  driverObj.drive();
};

/**
 * Helper para iniciar el tour de transacciones que abre el modal al terminar.
 */
export const startModalTour = (
  steps: any[],
  openModal: () => void,
  doneBtnText: string,
) => {
  const driverObj = driver({
    ...BASE_DRIVER_CONFIG,
    doneBtnText,
    steps,
    onDestroyStarted: () => {
      if (driverObj.isLastStep()) {
        openModal();
      }
      driverObj.destroy();
    },
  });
  driverObj.drive();
};

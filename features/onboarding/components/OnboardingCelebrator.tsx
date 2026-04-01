"use client";

import { useEffect, useState } from "react";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";
import toast from "react-hot-toast";

/**
 * Componente global (sin UI) que escucha el estado del onboarding
 * y dispara el toast de celebración con un diseño CUSTOM para evitar conflictos de tema.
 */
export function OnboardingCelebrator() {
  const { status } = useOnboardingStatus();
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (!status || hasCelebrated) return;

    if (status.isComplete && !status.isDismissed) {
      const CELEBRATION_KEY = "onboarding_celebrated";
      const alreadyShownGlobally = sessionStorage.getItem(CELEBRATION_KEY);

      if (!alreadyShownGlobally) {
        const timer = setTimeout(() => {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible
                    ? "animate-in fade-in zoom-in slide-in-from-top-10"
                    : "animate-out fade-out zoom-out"
                } max-w-md w-full bg-[#1a3a24] border-[4px] border-[#13ec5b] shadow-[0_0_80px_rgba(19,236,91,0.6)] rounded-[28px] p-6 pointer-events-auto flex flex-col items-center text-center gap-4`}
                style={{ zIndex: 2147483647 }}
              >
                <div className="w-16 h-16 bg-[#13ec5b]/20 rounded-full flex items-center justify-center border border-[#13ec5b]/30">
                  <span className="text-4xl">🏆</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[#13ec5b] font-black text-xl tracking-tight leading-tight">
                    ¡TODO LISTO!
                  </h3>
                  <p className="text-[#c7ffd8] text-sm font-bold leading-relaxed px-2">
                    Felicidades, has completado la configuración inicial. Tu
                    sistema ya está funcionando para ayudarte a dominar tus
                    finanzas. 🚀✨
                  </p>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="mt-2 bg-[#13ec5b] text-[#0d1b12] font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20"
                >
                  ¡A DARLE!
                </button>
              </div>
            ),
            {
              duration: 12000,
              position: "top-center",
            },
          );

          sessionStorage.setItem(CELEBRATION_KEY, "true");
          setHasCelebrated(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [status, hasCelebrated]);

  return null;
}

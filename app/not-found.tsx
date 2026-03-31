import Link from "next/link";
import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/15 rounded-full blur-[90px] pointer-events-none animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center justify-center w-36 h-36 animate-in fade-in zoom-in duration-700 drop-shadow-[0_0_15px_rgba(19,236,91,0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-primary"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 11v.01" />
              <path d="M10 6h1.499l4.5 -3l0 3.803a6.019 6.019 0 0 1 2.658 3.197h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1.342c-.057 .16 -.12 .318 -.19 .472m-1.467 2.528v1.5a1.5 1.5 0 0 1 -3 0v-.583a6.04 6.04 0 0 1 -1 .083h-4a6.04 6.04 0 0 1 -1 -.083v.583a1.5 1.5 0 0 1 -3 0v-2l0 -.027a6 6 0 0 1 1.5 -9.928" />
              <path d="M3 3l18 18" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex flex-col gap-2">
            <h1 className="text-6xl font-black text-text-main opacity-90 tracking-tighter">
              404
            </h1>
            <div className="h-1 w-12 bg-primary/50 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-text-main">
              ¡Ups! Fondos agotados
            </h2>
            <p className="text-text-sub font-medium text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
              Al parecer te gastaste todos tus ahorros buscando esta página,
              porque{" "}
              <span className="text-text-main font-bold italic underline decoration-primary/30 underline-offset-4">
                no existe
              </span>{" "}
              en nuestro sistema.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-4 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
        >
          <Button className="h-12 px-10 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95 text-sm">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            Regresar al inicio
          </Button>
        </Link>
      </div>

      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

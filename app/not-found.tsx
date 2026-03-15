import Link from "next/link";
import { Piggy404SVG } from "@/components/ui/piggy-404";
import Button from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center gap-6">
        
        {/* Animated SVG */}
        <div className="w-48 h-48 sm:w-64 sm:h-64">
          <Piggy404SVG />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-black text-gray-900 drop-shadow-sm">404</h1>
          <h2 className="text-xl font-bold text-gray-800">¡Ups! Fondos agotados</h2>
          <p className="text-gray-500 font-medium">
            Al parecer te gastaste todos tus ahorros buscando esta página, porque no existe en nuestro sistema.
          </p>
        </div>

        {/* Action button */}
        <Link href="/" className="w-full">
          <Button className="w-full h-12 bg-primary hover:bg-[#0fd650] text-[#0d1b12] font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined font-fill">arrow_back</span>
            Regresar al inicio
          </Button>
        </Link>
        
      </div>
    </div>
  );
}

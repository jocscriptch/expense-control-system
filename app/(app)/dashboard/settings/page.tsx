import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/actions";
import SettingsForm from "@/features/settings/components/SettingsForm";

export const metadata = {
  title: "Ajustes del Sistema | Finanzas",
  description: "Gestiona tu perfil, preferencias y seguridad de la cuenta.",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header de la página */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Ajustes del Sistema
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Gestiona tu perfil, preferencias y seguridad de la cuenta.
          </p>
        </div>
        
        {/* Breadcrumb style indicator */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <span className="material-symbols-outlined text-lg">home</span>
          <span>/</span>
          <span>Configuración</span>
          <span>/</span>
          <span className="text-primary font-semibold">General</span>
        </div>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}

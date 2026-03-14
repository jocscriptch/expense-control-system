import RecoverPasswordForm from "@/components/auth/RecoverPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña — Sistema de Gastos",
  description: "Recupera el acceso a tu cuenta.",
};

export default function RecoverPage() {
  return <RecoverPasswordForm />;
}

import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Contraseña — Sistema de Gastos",
  description: "Ingresa tu nueva contraseña.",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}

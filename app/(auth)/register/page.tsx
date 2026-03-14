import SignUpForm from "@/components/auth/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta — Sistema de Gastos",
  description: "Crea tu cuenta para comenzar a gestionar tus gastos.",
};

export default function RegisterPage() {
  return <SignUpForm />;
}

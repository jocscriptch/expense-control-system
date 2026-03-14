import SignInForm from "@/components/auth/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión — Sistema de Gastos",
  description: "Inicia sesión en tu cuenta para controlar tus gastos.",
};

export default function LoginPage() {
  return <SignInForm />;
}

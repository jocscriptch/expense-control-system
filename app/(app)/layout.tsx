/**
 * Layout base para todas las rutas de la app autenticada.
 * La lógica del shell (Sidebar, Header, Modal) vive en
 * app/(app)/dashboard/layout.tsx → DashboardLayoutClient
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

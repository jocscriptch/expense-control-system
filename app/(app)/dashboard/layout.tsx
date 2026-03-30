import { getCategories } from "@/features/transactions/actions";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

/**
 * Server Component que carga las categorías una sola vez
 * y las pasa al layout cliente.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: categories = [] } = await getCategories();

  return (
    <DashboardLayoutClient categories={categories}>
      {children}
    </DashboardLayoutClient>
  );
}

// genera los ultimos meses
export function getLastMonths(count: number = 3) {
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    const monthStr = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    const label =
      monthStr.charAt(0).toUpperCase() + monthStr.slice(1) + " " + year;

    return {
      label,
      month: date.getMonth(),
      year,
      id: `${date.getFullYear()}-${date.getMonth()}`,
    };
  });
}

// formatea la fecha a string ISO local (YYYY-MM-DD).
export function formatDateToISO(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA");
}

// retorna una fecha de referencia coherente para evitar discrepancias UTC.
// Usa el día 15 del mes para que cualquier desfase de zona horaria se mantenga en el mismo mes.
export function getEffectiveDate(month?: number, year?: number): Date {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  return new Date(targetYear, targetMonth, 15);
}

// calcula el rango (primer y último día) de un mes específico como strings ISO.
export function getMonthRange(month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  const firstDay = new Date(targetYear, targetMonth, 1).toISOString();
  const lastDay = new Date(targetYear, targetMonth + 1, 0).toISOString();

  return { firstDay, lastDay };
}

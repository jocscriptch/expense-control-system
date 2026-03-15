/**
 * Genera una lista de los últimos N meses, formateados en español.
 * @param count - Cantidad de meses a generar.
 * @returns Array de strings con el nombre del mes y el año.
 */
export function getLastMonths(count: number = 3): string[] {
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(1); // Evita problemas con meses de distinta duración (ej. día 31)
    date.setMonth(date.getMonth() - i);
    
    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    const label = `${month} ${year}`;
    
    // Capitaliza la primera letra (ej: "marzo 2026" -> "Marzo 2026")
    return label.charAt(0).toUpperCase() + label.slice(1);
  });
}

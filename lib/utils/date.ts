/**
 * Genera una lista de los últimos N meses, formateados en español.
 * @param count - Cantidad de meses a generar.
 * @returns Array de strings con el nombre del mes y el año.
 */
export function getLastMonths(count: number = 3) {
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(1); 
    date.setMonth(date.getMonth() - i);
    
    const monthStr = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    const label = monthStr.charAt(0).toUpperCase() + monthStr.slice(1) + " " + year;
    
    return {
      label,
      month: date.getMonth(),
      year,
      id: `${date.getFullYear()}-${date.getMonth()}`
    };
  });
}

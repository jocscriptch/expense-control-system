const DUMMY_EXPENSES = [
  {
    id: 1,
    categoryName: "Comida",
    categoryIcon: "shopping_cart",
    categoryColor: "orange",
    description: "Supermercado Semanal",
    method: "Walmart - Tarjeta Débito",
    date: "12 Oct 2023",
    amount: "$1,250.00",
    hasReceipt: true,
  },
  {
    id: 2,
    categoryName: "Transporte",
    categoryIcon: "directions_car",
    categoryColor: "blue",
    description: "Uber a la oficina",
    method: "Uber - PayPal",
    date: "11 Oct 2023",
    amount: "$150.00",
    hasReceipt: false,
  },
  {
    id: 3,
    categoryName: "Hogar",
    categoryIcon: "home",
    categoryColor: "purple",
    description: "Pago de Internet",
    method: "Izzi - Domiciliado",
    date: "10 Oct 2023",
    amount: "$500.00",
    hasReceipt: true,
  },
  {
    id: 4,
    categoryName: "Salud",
    categoryIcon: "medical_services",
    categoryColor: "red",
    description: "Consulta Médica General",
    method: "Farmacia San Pablo - Efectivo",
    date: "09 Oct 2023",
    amount: "$320.50",
    hasReceipt: false,
  },
  {
    id: 5,
    categoryName: "Ocio",
    categoryIcon: "movie",
    categoryColor: "pink",
    description: "Cinepolis Entradas VIP",
    method: "Cinepolis - Tarjeta Crédito",
    date: "08 Oct 2023",
    amount: "$280.00",
    hasReceipt: true,
  },
];

// Helper para mapear colores fijos a sus variantes Tailwind (adaptadas a Dark mode base)
const getColorMap = (colorName: string) => {
  const map: Record<string, string> = {
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };
  return map[colorName] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

export function ExpensesTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-colors duration-200">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
          <thead className="bg-background/80 text-text-sub font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 w-48 font-semibold tracking-wide">
                Categoría
              </th>
              <th className="px-6 py-4 w-auto font-semibold tracking-wide">
                Descripción
              </th>
              <th className="px-6 py-4 w-40 font-semibold tracking-wide">
                Fecha
              </th>
              <th className="px-6 py-4 w-32 text-right font-semibold tracking-wide">
                Monto
              </th>
              <th className="px-6 py-4 w-32 text-center font-semibold tracking-wide">
                Comprobante
              </th>
              <th className="px-6 py-4 w-24 text-right font-semibold tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DUMMY_EXPENSES.map((expense) => (
              <tr
                key={expense.id}
                className="group hover:bg-background/50 transition-colors"
              >
                {/* 1. Categoría Pill */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${getColorMap(
                      expense.categoryColor,
                    )}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {expense.categoryIcon}
                    </span>
                    {expense.categoryName}
                  </span>
                </td>

                {/* 2. Descripción */}
                <td className="px-6 py-4">
                  <div className="font-medium text-text-main">
                    {expense.description}
                  </div>
                  <div className="text-xs text-text-sub">{expense.method}</div>
                </td>

                {/* 3. Fecha */}
                <td className="px-6 py-4 text-text-sub">{expense.date}</td>

                {/* 4. Monto */}
                <td className="px-6 py-4 text-right font-medium text-text-main tabular-nums">
                  {expense.amount}
                </td>

                {/* 5. Comprobante */}
                <td className="px-6 py-4 text-center">
                  {expense.hasReceipt ? (
                    <button
                      className="text-primary hover:text-primary-hover transition-colors"
                      title="Ver Comprobante"
                    >
                      <span className="material-symbols-outlined filled text-[20px]">
                        receipt_long
                      </span>
                    </button>
                  ) : (
                    <span
                      className="text-text-dim/50 cursor-not-allowed"
                      title="Sin Comprobante"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        no_sim
                      </span>
                    </span>
                  )}
                </td>

                {/* 6. Acciones */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 text-text-sub hover:text-primary transition-colors"
                      title="Editar gasto"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      className="p-1 text-text-sub hover:text-red-500 transition-colors"
                      title="Eliminar gasto"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4">
        <div className="text-xs text-text-sub">
          Mostrando <span className="font-medium text-text-main">1</span> a{" "}
          <span className="font-medium text-text-main">5</span> de{" "}
          <span className="font-medium text-text-main">128</span> resultados
        </div>
        <div className="flex gap-2">
          <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary disabled:opacity-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-primary text-[#0d1b12] text-sm font-bold shadow-sm">
            1
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-main hover:border-primary hover:text-primary transition-colors text-sm">
            2
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-main hover:border-primary hover:text-primary transition-colors text-sm">
            3
          </button>
          <span className="flex size-8 items-center justify-center text-text-sub">
            ...
          </span>
          <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

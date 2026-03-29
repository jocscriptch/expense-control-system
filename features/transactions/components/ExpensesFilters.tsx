"use client";

export function ExpensesFilters() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 bg-surface p-4 rounded-xl shadow-sm border border-border">
      {/* Date Filter */}
      <button className="group flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:border-primary/50 transition-all">
        <span className="material-symbols-outlined text-text-sub group-hover:text-primary">
          calendar_today
        </span>
        <span className="text-text-main">Últimos 30 días</span>
        <span className="material-symbols-outlined text-text-sub text-lg">
          expand_more
        </span>
      </button>

      {/* Category Filter */}
      <button className="group flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:border-primary/50 transition-all">
        <span className="material-symbols-outlined text-text-sub group-hover:text-primary">
          category
        </span>
        <span className="text-text-main">Categoría: Todas</span>
        <span className="material-symbols-outlined text-text-sub text-lg">
          expand_more
        </span>
      </button>

      {/* Payment Method Filter */}
      <button className="group flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium hover:border-primary/50 transition-all">
        <span className="material-symbols-outlined text-text-sub group-hover:text-primary">
          credit_card
        </span>
        <span className="text-text-main">Método: Todos</span>
        <span className="material-symbols-outlined text-text-sub text-lg">
          expand_more
        </span>
      </button>

      {/* Toggle Household Expenses */}
      <label className="flex items-center gap-2 cursor-pointer h-10 px-3 rounded-lg hover:bg-background transition-colors select-none">
        <div className="relative flex items-center">
          <input
            className="peer size-4 rounded border-border text-primary focus:ring-primary bg-background focus:ring-offset-surface cursor-pointer custom-checkbox"
            type="checkbox"
          />
        </div>
        <span className="text-sm font-medium text-text-main">
          Solo gastos del hogar
        </span>
      </label>

      {/* Divider */}
      <div className="flex-grow"></div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="material-symbols-outlined text-text-sub text-[20px]">
            search
          </span>
        </div>
        <input
          className="block w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-text-dim text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
          placeholder="Buscar por descripción..."
          type="text"
        />
      </div>
    </div>
  );
}

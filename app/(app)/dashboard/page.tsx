"use client";

export default function DashboardPage() {
 return (
  <div className="space-y-6 transition-colors duration-200">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Card 1: Gasto del mes */}
      <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-text-sub text-sm font-medium">Gasto del mes</h3>
          <span className="material-symbols-outlined text-[20px] text-primary/40">payments</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-text-main">₡45,000.00</span>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center">
            <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
            +5%
          </span>
        </div>
        <p className="text-xs text-text-dim mt-3">vs. ₡42,800.00 mes anterior</p>
      </div>

      {/* Card 2: Presupuesto restante */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-text-sub text-sm font-medium">Presupuesto restante</h3>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">60% utilizado</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-text-main">₡75,000.00</span>
          <span className="text-xs text-text-dim">de ₡200,000.00</span>
        </div>
        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
        </div>
      </div>

      {/* Card 3: Ahorro estimado */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-text-sub text-sm font-medium">Saldo disponible</h3>
          <span className="material-symbols-outlined text-[20px] text-text-dim">savings</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-text-main">₡130,000.00</span>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center">
            <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
            +12%
          </span>
        </div>
        <p className="text-xs text-text-dim mt-3">Ingresos: ₡175,000.00</p>
      </div>
    </div>

    {/* Recent Transactions List */}
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-border flex justify-between items-center">
        <h3 className="text-base font-bold text-text-main">Últimos gastos</h3>
        <button className="text-sm font-semibold text-primary hover:text-primary-hover">Ver todos</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
          <thead className="bg-background/50 text-text-sub text-[10px] md:text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-4 md:px-6 py-4">Categoría</th>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Descripción</th>
              <th className="px-4 md:px-6 py-4 hidden md:table-cell">Fecha</th>
              <th className="px-4 md:px-6 py-4 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Dummy Data */}
            {[
              { cat: "Alimentación", icon: "shopping_cart", desc: "Supermercado Líder", date: "24 Oct, 2023", amount: "-₡45,000.00", color: "blue" },
              { cat: "Transporte", icon: "local_gas_station", desc: "Gasolina Shell", date: "23 Oct, 2023", amount: "-₡30,000.00", color: "amber" },
              { cat: "Ocio", icon: "movie", desc: "Cineplanet Entradas", date: "22 Oct, 2023", amount: "-₡18,500.00", color: "purple" },
              { cat: "Hogar", icon: "bolt", desc: "Pago Electricidad", date: "20 Oct, 2023", amount: "-₡55,000.00", color: "emerald", fill: true },
            ].map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-hover/50 transition-colors group text-sm md:text-base">
                <td className="px-4 md:px-6 py-4 text-text-main">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0
                      ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : ''}
                      ${item.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : ''}
                      ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-500' : ''}
                      ${item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                    `}>
                      <span className={`material-symbols-outlined text-[18px] md:text-[20px] ${item.fill ? 'font-fill' : ''}`}>{item.icon}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-text-main block">{item.cat}</span>
                      <span className="text-[10px] text-text-dim sm:hidden">{item.desc}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 text-text-sub font-medium hidden sm:table-cell">{item.desc}</td>
                <td className="px-4 md:px-6 py-4 text-text-dim text-sm hidden md:table-cell">{item.date}</td>
                <td className="px-4 md:px-6 py-4 text-right font-bold text-text-main">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
 );
}

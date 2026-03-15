"use client";

export default function DashboardPage() {
 return (
 <div className="space-y-6">
 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Card 1: Gasto del mes */}
 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm group hover:border-emerald-200 transition-all">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-gray-500 text-sm font-medium">Gasto del mes</h3>
 <span className="material-symbols-outlined text-[20px] text-emerald-200">payments</span>
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-bold text-gray-900 ">₡45,000.00</span>
 <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
 <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
 +5%
 </span>
 </div>
 <p className="text-xs text-gray-400 mt-3">vs. ₡42,800.00 mes anterior</p>
 </div>

 {/* Card 2: Presupuesto restante */}
 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-[#bbf7d0] transition-all">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-gray-500 text-sm font-medium">Presupuesto restante</h3>
 <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">60% utilizado</span>
 </div>
 <div className="flex items-baseline gap-2 mb-4">
 <span className="text-3xl font-bold text-gray-900 ">₡75,000.00</span>
 <span className="text-xs text-gray-400">de ₡200,000.00</span>
 </div>
 <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
 <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
 </div>
 </div>

 {/* Card 3: Ahorro estimado */}
 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-gray-200 transition-all">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-gray-500 text-sm font-medium">Saldo disponible</h3>
 <span className="material-symbols-outlined text-[20px] text-gray-300">savings</span>
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-bold text-gray-900 ">₡130,000.00</span>
 <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
 <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
 +12%
 </span>
 </div>
 <p className="text-xs text-gray-400 mt-3">Ingresos: ₡175,000.00</p>
 </div>
 </div>

 {/* Recent Transactions List */}
 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
 <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
 <h3 className="text-base font-bold text-gray-900 ">Últimos gastos</h3>
 <button className="text-sm font-semibold text-primary hover:text-primary-hover">Ver todos</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold tracking-wider">
 <tr>
 <th className="px-6 py-4">Categoría</th>
 <th className="px-6 py-4">Descripción</th>
 <th className="px-6 py-4">Fecha</th>
 <th className="px-6 py-4 text-right">Monto</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 ">
 {/* Dummy Data */}
 {[
 { cat: "Alimentación", icon: "shopping_cart", desc: "Supermercado Líder", date: "24 Oct, 2023", amount: "-₡45,000.00", color: "blue" },
 { cat: "Transporte", icon: "local_gas_station", desc: "Gasolina Shell", date: "23 Oct, 2023", amount: "-₡30,000.00", color: "amber" },
 { cat: "Ocio", icon: "movie", desc: "Cineplanet Entradas", date: "22 Oct, 2023", amount: "-₡18,500.00", color: "purple" },
 { cat: "Hogar", icon: "bolt", desc: "Pago Electricidad", date: "20 Oct, 2023", amount: "-₡55,000.00", color: "emerald", fill: true },
 ].map((item, idx) => (
 <tr key={idx} className="hover:bg-gray-50/50 :bg-[#1a3324]/50 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-4">
 <div className={`w-10 h-10 rounded-full flex items-center justify-center
 ${item.color === 'blue' ? 'bg-[#EFF6FF] text-[#3B82F6]' : ''}
 ${item.color === 'amber' ? 'bg-[#FFFBEB] text-[#F59E0B]' : ''}
 ${item.color === 'purple' ? 'bg-[#F3E8FF] text-[#A855F7]' : ''}
 ${item.color === 'emerald' ? 'bg-[#ECFDF5] text-[#10B981]' : ''}
 
 `}>
 <span className={`material-symbols-outlined text-[20px] ${item.fill ? 'font-fill' : ''}`}>{item.icon}</span>
 </div>
 <span className="font-semibold text-gray-900 ">{item.cat}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-gray-600 font-medium">{item.desc}</td>
 <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
 <td className="px-6 py-4 text-right font-bold text-gray-900 ">{item.amount}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}

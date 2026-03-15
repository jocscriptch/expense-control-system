"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrarGastoPage() {
 const router = useRouter();
 const [isRecurring, setIsRecurring] = useState(false);

 return (
 <div className="flex flex-col items-center justify-center py-8">
 {/* Main Container */}
 <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 ">
 
 {/* Left Column: Primary Inputs */}
 <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 border-r border-gray-100 ">
 
 {/* Header */}
 <div className="flex justify-between items-start">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">Registrar Gasto</h1>
 <p className="text-emerald-700 text-sm mt-1 font-medium">Ingresa los detalles de tu nuevo movimiento</p>
 </div>
 <button 
 onClick={() => router.back()}
 className="text-gray-400 hover:text-gray-600 :text-gray-200 transition-colors"
 >
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>

 {/* Large Amount Input */}
 <div className="mt-4">
 <label className="block text-sm font-medium text-slate-500 mb-2">Monto del gasto</label>
 <div className="relative flex items-center">
 <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-bold text-slate-900 pl-4">₡</span>
 <input 
 autoFocus
 type="number"
 className="w-full bg-slate-50 border-0 rounded-2xl py-6 pl-12 pr-6 text-5xl font-bold text-slate-900 placeholder-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" 
 placeholder="0.00" 
 />
 </div>
 </div>

 {/* Grid Form */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
 {/* Category */}
 <div className="flex flex-col gap-2">
 <label className="text-sm font-medium text-slate-900 ">Categoría</label>
 <div className="relative">
 <select defaultValue="" className="w-full h-12 pl-11 pr-10 bg-white border border-gray-200 rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-slate-900 ">
 <option value="" disabled>Seleccionar</option>
 <option value="food">Alimentación</option>
 <option value="transport">Transporte</option>
 <option value="home">Hogar</option>
 <option value="entertainment">Entretenimiento</option>
 </select>
 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">category</span>
 <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
 </div>
 </div>

 {/* Date */}
 <div className="flex flex-col gap-2 relative">
 <label className="text-sm font-medium text-slate-900 ">Fecha</label>
 <div className="relative">
 <input 
 type="date"
 className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-slate-900 " 
 />
 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">calendar_today</span>
 </div>
 </div>
 </div>

 {/* Payment Method Segmented Control */}
 <div className="flex flex-col gap-2 mt-2">
 <label className="text-sm font-medium text-slate-900 ">Método de pago</label>
 <div className="flex p-1 bg-slate-50 rounded-xl border border-gray-100 ">
 <label className="flex-1 relative cursor-pointer group">
 <input type="radio" name="payment_method" className="sr-only peer" defaultChecked />
 <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-gray-500 peer-checked:bg-white :bg-[#1a3324] peer-checked:text-emerald-600 :text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
 <span className="material-symbols-outlined text-[18px]">payments</span>
 Efectivo
 </div>
 </label>
 <label className="flex-1 relative cursor-pointer group">
 <input type="radio" name="payment_method" className="sr-only peer" />
 <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-gray-500 peer-checked:bg-white :bg-[#1a3324] peer-checked:text-emerald-600 :text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
 <span className="material-symbols-outlined text-[18px]">credit_card</span>
 Tarjeta
 </div>
 </label>
 <label className="flex-1 relative cursor-pointer group">
 <input type="radio" name="payment_method" className="sr-only peer" />
 <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-gray-500 peer-checked:bg-white :bg-[#1a3324] peer-checked:text-emerald-600 :text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
 <span className="material-symbols-outlined text-[18px]">phonelink_ring</span>
 SINPE
 </div>
 </label>
 </div>
 </div>

 {/* Description */}
 <div className="flex flex-col gap-2 mt-2">
 <label className="text-sm font-medium text-slate-900 ">Nota (Opcional)</label>
 <textarea 
 rows={2}
 className="w-full p-3 bg-white border border-gray-200 rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder-gray-400 " 
 placeholder="Añade una descripción..." 
 ></textarea>
 </div>
 </div>

 {/* Right Column: Settings & Actions */}
 <div className="w-full md:w-[320px] bg-slate-50 p-6 sm:p-8 flex flex-col gap-6 justify-between border-l border-gray-100 ">
 
 <div className="flex flex-col gap-6">
 <h2 className="text-lg font-semibold text-slate-900 ">Opciones</h2>
 
 {/* Toggles Group */}
 <div className="space-y-4">
 
 {/* Gasto del hogar */}
 <label className="flex items-center justify-between cursor-pointer group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors shadow-sm">
 <span className="material-symbols-outlined text-lg">home</span>
 </div>
 <span className="text-sm font-medium text-slate-900 ">Gasto del hogar</span>
 </div>
 <div className="relative inline-flex items-center">
 <input type="checkbox" className="sr-only peer" />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
 </div>
 </label>

 {/* Compartido */}
 <label className="flex items-center justify-between cursor-pointer group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors shadow-sm">
 <span className="material-symbols-outlined text-lg">group</span>
 </div>
 <span className="text-sm font-medium text-slate-900 ">Compartido</span>
 </div>
 <div className="relative inline-flex items-center">
 <input type="checkbox" className="sr-only peer" />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
 </div>
 </label>

 {/* Recurrente */}
 <div className="flex flex-col gap-3">
 <label className="flex items-center justify-between cursor-pointer group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors shadow-sm">
 <span className="material-symbols-outlined text-lg">update</span>
 </div>
 <span className="text-sm font-medium text-slate-900 ">Recurrente</span>
 </div>
 <div className="relative inline-flex items-center">
 <input 
 type="checkbox" 
 className="sr-only peer" 
 checked={isRecurring}
 onChange={(e) => setIsRecurring(e.target.checked)}
 />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
 </div>
 </label>

 {/* Hidden frequency options */}
 {isRecurring && (
 <div className="flex flex-col gap-2 pl-11 pt-1 transition-all">
 <select defaultValue="Mensual" className="w-full text-sm bg-white border border-gray-200 rounded-lg py-2 px-3 text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none cursor-pointer">
 <option value="Mensual">Mensual</option>
 <option value="Semanal">Semanal</option>
 <option value="Anual">Anual</option>
 </select>
 </div>
 )}
 </div>
 </div>

 {/* File Upload */}
 <div className="mt-4 pt-4 border-t border-gray-200 ">
 <label className="text-sm font-medium text-slate-900 mb-2 block">Comprobante</label>
 <div className="border-2 border-dashed border-gray-300 bg-white/50 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
 <span className="material-symbols-outlined text-gray-400 group-hover:text-primary mb-1">cloud_upload</span>
 <p className="text-xs text-gray-500 ">
 <span className="font-semibold text-primary">Clic para subir</span> o arrastra
 </p>
 <p className="text-[10px] text-gray-400 mt-1">PDF, PNG, JPG (Max 5MB)</p>
 </div>
 </div>
 
 </div>

 {/* Actions */}
 <div className="flex flex-col gap-3 mt-auto pt-6">
 <button className="w-full h-12 bg-primary hover:bg-[#0fd650] text-[#0d1b12] font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
 <span className="material-symbols-outlined font-fill text-[20px]">check_circle</span>
 Guardar gasto
 </button>
 <button 
 onClick={() => router.back()}
 className="w-full h-12 bg-transparent hover:bg-gray-200 :bg-white/5 text-slate-600 font-medium rounded-xl transition-colors"
 >
 Cancelar
 </button>
 </div>

 </div>
 </div>
 </div>
 );
}

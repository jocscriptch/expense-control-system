"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrarGastoPage() {
 const router = useRouter();
 const [isRecurring, setIsRecurring] = useState(false);

 return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-main">Registrar Gasto</h1>
        <p className="text-primary text-sm font-medium">Ingresa los detalles de tu nuevo movimiento</p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-surface rounded-xl border border-border flex flex-col lg:flex-row transition-colors overflow-hidden ring-1 ring-border/50">
        
        {/* Left Column: Primary Inputs */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 border-r border-border">
          
          {/* Large Amount Input */}
          <div className="">
            <label className="block text-sm font-medium text-text-sub mb-2">Monto del gasto</label>
            <div className="relative flex items-center">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-text-main pl-4">₡</span>
              <input 
                autoFocus
                type="number"
                min="0.01"
                step="0.01"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                className="w-full bg-background border-0 rounded-2xl py-4 md:py-6 pl-10 md:pl-12 pr-6 text-3xl md:text-5xl font-bold text-text-main placeholder:text-text-dim focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" 
                placeholder="0.00" 
              />
            </div>
            <p className="text-[10px] text-text-dim mt-2 italic px-1">El monto debe ser superior a cero.</p>
          </div>

          {/* Grid Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-main ">Categoría</label>
              <div className="relative">
                <select defaultValue="" className="w-full h-12 pl-11 pr-10 bg-background border border-border rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-text-main ">
                  <option value="" disabled>Seleccionar</option>
                  <option value="food">Alimentación</option>
                  <option value="transport">Transporte</option>
                  <option value="home">Hogar</option>
                  <option value="entertainment">Entretenimiento</option>
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">category</span>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none text-xl">expand_more</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-text-main ">Fecha</label>
              <div className="relative">
                <input 
                  type="date"
                  className="w-full h-12 pl-11 pr-4 bg-background border border-border rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-text-main " 
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">calendar_today</span>
              </div>
            </div>
          </div>

          {/* Payment Method Segmented Control */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main ">Método de pago</label>
            <div className="flex p-1 bg-background rounded-xl border border-border ">
              <label className="flex-1 relative cursor-pointer group">
                <input type="radio" name="payment_method" className="sr-only peer" defaultChecked />
                <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-text-sub peer-checked:bg-surface peer-checked:text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  Efectivo
                </div>
              </label>
              <label className="flex-1 relative cursor-pointer group">
                <input type="radio" name="payment_method" className="sr-only peer" />
                <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-text-sub peer-checked:bg-surface peer-checked:text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  Tarjeta
                </div>
              </label>
              <label className="flex-1 relative cursor-pointer group">
                <input type="radio" name="payment_method" className="sr-only peer" />
                <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-text-sub peer-checked:bg-surface peer-checked:text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">phonelink_ring</span>
                  SINPE
                </div>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main ">Nota (Opcional)</label>
            <textarea 
              rows={2}
              className="w-full p-3 bg-background border border-border rounded-xl text-base text-text-main focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-text-dim " 
              placeholder="Añade una descripción..." 
            ></textarea>
          </div>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="w-full lg:w-[320px] bg-surface p-6 sm:p-8 flex flex-col gap-6 justify-between transition-colors">
          
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-text-main ">Opciones adicionales</h2>
            
            {/* Toggles Group */}
            <div className="space-y-4">
              
              {/* Gasto del hogar */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-sub group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-lg">home</span>
                  </div>
                  <span className="text-sm font-medium text-text-main ">Gasto del hogar</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              {/* Compartido */}
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-sub group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-lg">group</span>
                  </div>
                  <span className="text-sm font-medium text-text-main ">Compartido</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              {/* Recurrente */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-sub group-hover:text-primary transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-lg">update</span>
                    </div>
                    <span className="text-sm font-medium text-text-main ">Recurrente</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 :ring-primary/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>

                {/* Hidden frequency options */}
                {isRecurring && (
                  <div className="flex flex-col gap-2 pl-11 pt-1 transition-all">
                    <select defaultValue="Mensual" className="w-full text-sm bg-background border border-border rounded-lg py-2 px-3 text-text-main focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none cursor-pointer">
                      <option value="Mensual">Mensual</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-4 pt-4 border-t border-border ">
              <label className="text-sm font-medium text-text-main mb-2 block">Comprobante</label>
              <div className="border-2 border-dashed border-border bg-background rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                <span className="material-symbols-outlined text-text-dim group-hover:text-primary mb-1">cloud_upload</span>
                <p className="text-xs text-text-sub ">
                  <span className="font-semibold text-primary">Clic para subir</span>
                </p>
                <p className="text-[10px] text-text-dim mt-1">PDF, PNG, JPG (Max 5MB)</p>
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
              className="w-full h-12 bg-transparent hover:bg-surface-hover text-text-sub hover:text-text-main font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>

 );
}

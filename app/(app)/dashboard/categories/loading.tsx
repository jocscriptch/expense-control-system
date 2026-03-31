import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ResponsiveTableWrapper } from "@/components/ui/ResponsiveTableWrapper";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header Skeleton */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>

      <div className="w-full flex flex-col h-full bg-background">
        {/* Metricas / Top Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-none">
          {Array.from({ length: 2 }).map((_, i) => (
             <div key={i} className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-start">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-5 w-5 rounded" />
               </div>
               <div className="flex items-baseline gap-2 mt-2">
                 <Skeleton className="h-8 w-40" />
               </div>
               <Skeleton className="h-3 w-48 mt-1" />
             </div>
          ))}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-start gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-lg mt-1" />
          </div>
        </div>

        {/* Tabla / Lista Skeletons */}
        <div className="flex-1 min-h-[400px] bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden relative">
          <ResponsiveTableWrapper
            desktopContent={
              <div className="w-full">
                <div className="border-b border-border bg-background/80 px-6 py-4 flex gap-4">
                  <Skeleton className="h-5 w-10 mx-auto" />
                  <Skeleton className="h-5 w-32 flex-1" />
                  <Skeleton className="h-5 w-24 ml-auto" />
                  <Skeleton className="h-5 w-16 ml-8" />
                </div>
                <div className="divide-y divide-border">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex p-4 px-6 gap-4 items-center">
                      <div className="w-16 flex justify-center"><Skeleton className="h-10 w-10 rounded-lg" /></div>
                      <div className="flex-1 flex flex-col gap-1">
                        <Skeleton className="h-5 w-40 rounded" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <div className="flex flex-col items-end gap-1 w-40">
                        <Skeleton className="h-5 w-24 rounded" />
                        <Skeleton className="h-4 w-32 ml-auto" />
                      </div>
                      <div className="flex gap-2 w-24 justify-end">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            mobileContent={
               <div className="p-4 flex flex-col gap-4">
                 {Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className="flex flex-col gap-3 p-4 bg-background border border-border rounded-xl">
                     <div className="flex items-center gap-3">
                       <Skeleton className="h-10 w-10 rounded-xl" />
                       <div className="flex-1 flex flex-col gap-1">
                         <Skeleton className="h-5 w-32 rounded" />
                         <Skeleton className="h-4 w-20 rounded-full" />
                       </div>
                       <Skeleton className="h-5 w-24" />
                     </div>
                     <Skeleton className="h-2 w-full rounded-full mt-2" />
                     <div className="flex justify-end gap-2 mt-1">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                     </div>
                   </div>
                 ))}
               </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

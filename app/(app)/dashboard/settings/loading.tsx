import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Skeleton */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-64 md:w-80" />
          <Skeleton className="h-6 w-72 md:w-96" />
        </div>
        <div className="hidden md:flex gap-2 items-center">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Form Sections Skeleton */}
      <div className="flex flex-col gap-8 pb-10">
        {Array.from({ length: 3 }).map((_, sectionIdx) => (
          <section key={sectionIdx} className="bg-surface rounded-xl border border-border p-4 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-7 w-40" />
            </div>

            <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4 flex justify-center md:justify-start">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                {sectionIdx === 0 && (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
        
        {/* Skeleton Fixed Save Button Footer */}
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-12 w-full sm:w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

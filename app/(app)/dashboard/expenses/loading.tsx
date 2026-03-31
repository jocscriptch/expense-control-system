import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ResponsiveTableWrapper } from "@/components/ui/ResponsiveTableWrapper";

export default function ExpensesLoading() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex-none mb-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-72 max-w-full" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 self-start sm:self-auto">
            {/* Simulation of filters buttons */}
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl hidden sm:block" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        <ResponsiveTableWrapper
          desktopContent={
            <div className="w-full">
              {/* Table Header Wrapper */}
              <div className="border-b border-border bg-background">
                <div className="flex p-4 gap-4 items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40 flex-1" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              {/* Table Body */}
              <div className="divide-y divide-border">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex p-4 gap-4 items-center hover:bg-surface-hover/50">
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-5 w-40 flex-1 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded" />
                    <div className="flex gap-1 ml-auto shrink-0 w-16 justify-end">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          mobileContent={
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <div className="flex flex-col gap-2">
                       <Skeleton className="h-4 w-40 rounded" />
                       <Skeleton className="h-7 w-28 rounded mt-1" />
                       <Skeleton className="h-4 w-20 rounded mt-1 hidden sm:block" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0 mb-1">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}

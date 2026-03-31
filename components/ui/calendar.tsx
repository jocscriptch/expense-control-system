"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-fit relative", className)}
      classNames={{
        months: "flex flex-col",
        month: "flex flex-col gap-4 w-full",

        month_caption: "flex items-center justify-center h-8",
        caption_label: "text-sm font-bold text-text-main capitalize",
        nav: "absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none",
        button_previous: cn(
          "h-8 w-8 flex items-center justify-center rounded-lg pointer-events-auto bg-transparent border-0",
          "text-text-dim hover:text-text-main hover:bg-surface-hover transition-all",
        ),
        button_next: cn(
          "h-8 w-8 flex items-center justify-center rounded-lg pointer-events-auto bg-transparent border-0",
          "text-text-dim hover:text-text-main hover:bg-surface-hover transition-all",
        ),

        // Grid (tabla de días)
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full mb-2",
        weekday:
          "text-text-dim font-medium text-[0.8rem] w-10 text-center uppercase m-0 p-0",

        // Semanas
        weeks: "flex flex-col gap-1 w-full",
        week: "flex w-full m-0 p-0",

        // Celda individual y botón del día
        day: cn(
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 relative focus-within:z-20",
          "aria-selected:bg-primary/20",
          "first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl"
        ),
        day_button: cn(
          "h-10 w-10 p-0 font-normal transition-all", // Aumentado a h-10 w-10 para llenar la celda
          "flex items-center justify-center bg-transparent border-0 rounded-xl",
          "text-text-sub hover:bg-surface-hover hover:text-text-main",
          "aria-selected:bg-primary aria-selected:text-[#0d1b12] aria-selected:font-bold",
          "focus-visible:outline-none"
        ),

        // Estilos para RANGOS
        day_selected: "bg-primary text-[#0d1b12] hover:bg-primary hover:text-[#0d1b12] focus:bg-primary focus:text-[#0d1b12]",
        range_start: "day_range_start aria-selected:bg-primary aria-selected:text-[#0d1b12] !rounded-l-xl !rounded-r-none",
        range_end: "day_range_end aria-selected:bg-primary aria-selected:text-[#0d1b12] !rounded-r-xl !rounded-l-none",
        range_middle: "day_range_middle aria-selected:!bg-primary/20 aria-selected:!text-primary !rounded-none",

        today: "font-extrabold text-[#0d1b12] dark:text-white bg-primary/30 border-2 border-primary rounded-[10px]",
        outside: "text-text-dim opacity-30 aria-selected:opacity-50",
        disabled:
          "text-text-dim opacity-50 cursor-not-allowed hover:bg-transparent",
        hidden: "invisible",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ArrowLeft className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

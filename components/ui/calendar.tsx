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
        day: "w-10 h-10 flex items-center justify-center p-0 m-0",
        day_button: cn(
          "w-9 h-9 font-normal text-sm rounded-xl transition-all cursor-pointer",
          "flex items-center justify-center bg-transparent border-0",
          "text-text-sub hover:bg-surface-hover hover:text-text-main",
          "active:scale-90 active:bg-surface-hover active:text-text-main",
          "focus-visible:outline-none",
          "aria-selected:bg-primary aria-selected:text-[#0d1b12] aria-selected:font-bold aria-selected:shadow-md aria-selected:hover:bg-primary-hover",
        ),

        today:
          "font-extrabold text-[#0d1b12] dark:text-white bg-primary/30 border-2 border-primary rounded-[10px]",
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

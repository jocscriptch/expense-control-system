"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerShadcnProps {
  value: string;
  onChange: (date: string) => void;
}

export function DatePickerShadcn({ value, onChange }: DatePickerShadcnProps) {
  const date = value ? new Date(value + "T00:00:00") : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formatted = format(selectedDate, "yyyy-MM-dd");
      onChange(formatted);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-main">Fecha</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-12 justify-start text-left font-normal bg-background border-border hover:bg-surface-hover hover:border-text-dim rounded-xl pl-4",
              !date && "text-text-dim",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {date ? (
              <span className="capitalize">
                {format(date, "PPP", { locale: es })}
              </span>
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-border bg-surface shadow-2xl rounded-2xl overflow-hidden z-[1000]"
          align="center"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

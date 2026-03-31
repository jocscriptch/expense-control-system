"use client";

import { useState, useEffect, useRef } from "react";
import { getReportsData, ReportsData, ReportsFilters } from "../reportsActions";

interface useReportsProps {
  period: "week" | "month" | "year" | "custom";
  startDate?: Date;
  endDate?: Date;
}

export function useReports({ period, startDate, endDate }: useReportsProps) {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(!reportsData);
  const [error, setError] = useState<string | null>(null);

  const startDateStr = startDate?.toISOString().split("T")[0];
  const endDateStr = endDate?.toISOString().split("T")[0];
  const paramsKey = `${period}-${startDateStr}-${endDateStr}`;
  const lastParams = useRef<string | null>(null);

  useEffect(() => {
    if (lastParams.current === paramsKey) {
      if (isLoading) setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        const filters: ReportsFilters = {
          period,
          startDate: startDateStr,
          endDate: endDateStr,
        };

        const result = await getReportsData(filters);

        if (result.success && result.data) {
          setReportsData(result.data);
          lastParams.current = paramsKey;
        } else {
          setError(result.error || "Error al cargar datos");
        }
      } catch (err: any) {
        setError(err.message || "Error inesperado");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [period, startDateStr, endDateStr, paramsKey, isLoading]);

  return { reportsData, isLoading, error };
}

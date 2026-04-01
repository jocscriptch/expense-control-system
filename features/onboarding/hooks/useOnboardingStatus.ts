"use client";

import { useState, useEffect } from "react";
import {
  getOnboardingStatus,
  OnboardingStatus,
} from "../actions/onboardingActions";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";

/**
 * Hook que mantiene el estado del onboarding.
 * Acepta un initialStatus del padre para evitar un fetch duplicado en el render inicial.
 */
export function useOnboardingStatus(
  initialStatus: OnboardingStatus | null = null,
) {
  const [status, setStatus] = useState<OnboardingStatus | null>(initialStatus);
  const { refreshTrigger } = useTransactionModal();

  useEffect(() => {
    if (!status) {
      const fetchInitial = async () => {
        const result = await getOnboardingStatus();
        if (result.success && result.data) setStatus(result.data);
      };
      fetchInitial();
    }
  }, []);

  useEffect(() => {
    if (refreshTrigger === 0) return;
    const refetch = async () => {
      const result = await getOnboardingStatus();
      if (result.success && result.data) setStatus(result.data);
    };
    refetch();
  }, [refreshTrigger]);

  const refresh = async () => {
    const result = await getOnboardingStatus();
    if (result.success && result.data) setStatus(result.data);
  };

  return { status, refresh };
}

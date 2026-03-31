"use client";

import React, { createContext, useContext, useState } from "react";
import type { TransactionWithCategory } from "../types";

interface TransactionModalContextValue {
  isOpen: boolean;
  editingTransaction: TransactionWithCategory | null;
  openModal: (transaction?: TransactionWithCategory) => void;
  closeModal: () => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const TransactionModalContext =
  createContext<TransactionModalContextValue | null>(null);

export function TransactionModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionWithCategory | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const openModal = (transaction?: TransactionWithCategory) => {
    setEditingTransaction(transaction || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setEditingTransaction(null);
    }, 400);
  };

  return (
    <TransactionModalContext.Provider
      value={{
        isOpen,
        editingTransaction,
        openModal,
        closeModal,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal() {
  const ctx = useContext(TransactionModalContext);
  if (!ctx)
    throw new Error(
      "useTransactionModal must be used within TransactionModalProvider",
    );
  return ctx;
}

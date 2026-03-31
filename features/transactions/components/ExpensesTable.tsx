"use client";

import React, { useState, useTransition } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import type { TransactionWithCategory } from "../types";
import { deleteTransactionAction, getReceiptSignedUrlAction } from "../actions";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReceiptPreviewModal } from "./ReceiptPreviewModal";
import { ResponsiveTableWrapper } from "@/components/ui/ResponsiveTableWrapper";
import { useTransactionModal } from "../context/TransactionModalContext";
import toast from "react-hot-toast";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  sinpe: "SINPE Móvil",
};

interface ExpensesTableProps {
  initialData: TransactionWithCategory[];
}

export function ExpensesTable({ initialData }: ExpensesTableProps) {
  const router = useRouter();
  const { openModal } = useTransactionModal();
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TransactionWithCategory[]>(initialData);

  const searchParams = useSearchParams();

  // Sincronizar y filtrar datos del servidor
  React.useEffect(() => {
    const q = searchParams.get("q")?.toLowerCase();
    const cat = searchParams.get("category");
    const method = searchParams.get("method");
    const household = searchParams.get("household");
    const dateFilter = searchParams.get("date"); // "this_month", "this_year", "YYYY-MM-DD"

    let filtered = [...initialData];

    if (q) {
      filtered = filtered.filter(tx => 
        (tx.description || "").toLowerCase().includes(q) || 
        (tx.category?.name.toLowerCase() || "").includes(q)
      );
    }
    if (cat) {
      filtered = filtered.filter(tx => tx.category_id === cat);
    }
    if (method) {
      filtered = filtered.filter(tx => tx.payment_method === method);
    }
    if (household === "true") {
      filtered = filtered.filter(tx => tx.is_household === true);
    }
    if (dateFilter) {
      const today = new Date();
      if (dateFilter === "this_month") {
        // En YYYY-MM-DD
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        filtered = filtered.filter(tx => tx.date >= startOfMonth);
      } else if (dateFilter === "this_year") {
        const startOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        filtered = filtered.filter(tx => tx.date >= startOfYear);
      } else {
        // Match exacto YYYY-MM-DD
        filtered = filtered.filter(tx => tx.date === dateFilter);
      }
    }

    // Excluir ingresos por defecto (la tabla es de Gastos)
    filtered = filtered.filter(tx => tx.category?.type !== "income");

    setData(filtered);
  }, [initialData, searchParams]);

  // Delete dialog state
  const [toDelete, setToDelete] = useState<TransactionWithCategory | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const handleViewReceipt = async (path: string, fileName?: string) => {
    const loadingToast = toast.loading("Generando vista previa...");
    const result = await getReceiptSignedUrlAction(path);
    toast.dismiss(loadingToast);

    if (result.success && result.url) {
      setPreviewUrl(result.url);
      setPreviewName(fileName || "Comprobante");
      setIsPreviewOpen(true);
    } else {
      toast.error(result.error || "No se pudo cargar la vista previa.");
    }
  };

  const handleDeleteClick = (row: TransactionWithCategory) => {
    setToDelete(row);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteError) {
      setIsDeleteOpen(false);
      setDeleteError(null);
      return;
    }
    if (!toDelete) return;

    startTransition(async () => {
      const result = await deleteTransactionAction(toDelete.id);
      if (result.success) {
        setData((prev) => prev.filter((t) => t.id !== toDelete.id));
        setIsDeleteOpen(false);
        setToDelete(null);
        toast.success("Gasto eliminado exitosamente", { icon: "🗑️" });
      } else {
        setDeleteError(result.error || "No se pudo eliminar el gasto.");
      }
    });
  };

  const columns: ColumnDef<TransactionWithCategory>[] = [
    {
      id: "category",
      header: "Categoría",
      accessorFn: (row) => row.category?.name ?? "—",
      cell: ({ row }) => {
        const cat = row.original.category;
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border"
            style={{
              backgroundColor: cat?.color ? `${cat.color}18` : "transparent",
              color: cat?.color ?? "var(--color-text-sub)",
              borderColor: cat?.color ? `${cat.color}35` : "var(--color-border)",
            }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {cat?.icon ?? "category"}
            </span>
            {cat?.name ?? "Sin categoría"}
          </span>
        );
      },
    },
    {
      id: "description",
      header: "Descripción",
      accessorFn: (row) => row.description ?? "—",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-text-main text-sm">
            {row.original.description || <span className="text-text-dim italic">Sin descripción</span>}
          </div>
          <div className="text-xs text-text-sub mt-0.5">
            {PAYMENT_METHOD_LABELS[row.original.payment_method] ?? row.original.payment_method}
          </div>
        </div>
      ),
    },
    {
      id: "date",
      header: "Fecha",
      accessorKey: "date",
      cell: ({ getValue }) => {
        const raw = getValue() as string;
        const [year, month, day] = raw.split("-");
        return (
          <span className="text-text-sub text-sm">
            {`${day}/${month}/${year}`}
          </span>
        );
      },
    },
    {
      id: "amount",
      header: "Monto",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <div className="text-right">
          <AmountDisplay value={Number(getValue())} className="text-sm font-bold justify-end" />
        </div>
      ),
    },
    {
      id: "receipt",
      header: "Comprobante",
      cell: ({ row }) => {
        const path = row.original.attachment_url;
        const name = row.original.description || "Gasto sin notas";
        
        return path ? (
          <button
            onClick={() => handleViewReceipt(path, name)}
            className="text-primary hover:text-primary-hover transition-colors mx-auto block hover:scale-110"
            title="Ver comprobante"
          >
            <span className="material-symbols-outlined text-[20px] font-fill">receipt_long</span>
          </button>
        ) : (
          <span className="text-text-dim/20 mx-auto block w-fit" title="Sin comprobante">
            <span className="material-symbols-outlined text-[20px]">hide_source</span>
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openModal(row.original)}
            className="p-1.5 text-text-sub hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            title="Editar gasto"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="p-1.5 text-text-sub hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
            title="Eliminar gasto"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount();

  return (
    <>
      <ResponsiveTableWrapper
        desktopContent={
          <table className="w-full min-w-[700px] text-left text-sm whitespace-nowrap">
            <thead className="bg-background/80 text-text-sub border-b border-border">
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    className={`px-5 py-4 font-semibold tracking-wide ${
                      header.id === "amount" ? "text-right" : ""
                    } ${header.id === "receipt" ? "text-center" : ""} ${
                      header.column.getCanSort() ? "cursor-pointer select-none hover:text-text-main transition-colors" : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1 group/sort">
                      {header.id === "amount" ? (
                        <span className="ml-auto flex items-center gap-1">
                          Monto
                          {header.column.getCanSort() && (
                            <span className={`material-symbols-outlined text-[16px] transition-colors ${
                              header.column.getIsSorted() ? "text-text-main" : "text-text-dim opacity-40 group-hover/sort:opacity-100"
                            }`}>
                              {header.column.getIsSorted() === "asc" ? "arrow_upward" : 
                               header.column.getIsSorted() === "desc" ? "arrow_downward" : "unfold_more"}
                            </span>
                          )}
                        </span>
                      ) : (
                        <>
                          {typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : ""}
                          {header.column.getCanSort() && (
                            <span className={`material-symbols-outlined text-[16px] transition-colors ${
                              header.column.getIsSorted() ? "text-text-main" : "text-text-dim opacity-40 group-hover/sort:opacity-100"
                            }`}>
                              {header.column.getIsSorted() === "asc" ? "arrow_upward" : 
                               header.column.getIsSorted() === "desc" ? "arrow_downward" : "unfold_more"}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-text-sub">
                    <span className="material-symbols-outlined text-4xl mb-2 block text-text-dim">receipt_long</span>
                    No hay gastos registrados aún.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-background/50 transition-colors ${isPending ? "opacity-60" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-5 py-3.5 ${cell.column.id === "receipt" ? "text-center" : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        }
        mobileContent={
          table.getRowModel().rows.length === 0 ? (
            <div className="py-16 text-center text-text-sub">
              <span className="material-symbols-outlined text-4xl mb-2 block text-text-dim">receipt_long</span>
              No hay gastos registrados aún.
            </div>
          ) : (
            table.getRowModel().rows.map((row) => {
              const t = row.original;
              const cat = t.category;
              const [y, m, d] = t.date.split("-");
              return (
                <div key={t.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border"
                      style={{
                        backgroundColor: cat?.color ? `${cat.color}18` : "transparent",
                        color: cat?.color ?? "var(--color-text-sub)",
                        borderColor: cat?.color ? `${cat.color}35` : "var(--color-border)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">{cat?.icon ?? "category"}</span>
                      {cat?.name ?? "Sin categoría"}
                    </span>
                    <span className="text-xs font-medium text-text-sub">{`${d}/${m}/${y}`}</span>
                  </div>
                  
                  <div className="flex items-end justify-between mt-1">
                    <div className="flex flex-col gap-1 overflow-hidden pr-2">
                      <span className="text-[13px] font-medium text-text-main line-clamp-1 truncate">
                        {t.description || <span className="text-text-dim italic text-xs">Sin descripción</span>}
                      </span>
                      <AmountDisplay value={Number(t.amount)} className="text-xl font-bold text-text-main tracking-tight mt-0.5" />
                      <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider mt-0.5 bg-background border border-border w-fit px-2 py-0.5 rounded-md">
                        {PAYMENT_METHOD_LABELS[t.payment_method] ?? t.payment_method}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0 mb-1">
                      {t.attachment_url && (
                        <button
                          onClick={() => handleViewReceipt(t.attachment_url!, t.description || "Gasto")}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Ver comprobante"
                        >
                          <span className="material-symbols-outlined text-[18px] font-fill">receipt_long</span>
                        </button>
                      )}
                      <button
                        onClick={() => openModal(t)}
                        className="p-1.5 text-text-sub hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(t)}
                        className="p-1.5 text-text-sub hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Borrar"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )
        }
        footerContent={
          totalRows > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-surface px-5 py-3 gap-3">
            <div className="text-xs text-text-sub">
              Mostrando <span className="font-semibold text-text-main">{from}</span> a{" "}
              <span className="font-semibold text-text-main">{to}</span> de{" "}
              <span className="font-semibold text-text-main">{totalRows}</span> gastos
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    i === pageIndex
                      ? "bg-primary text-[#0d1b12] shadow-sm"
                      : "border border-border bg-background text-text-main hover:border-primary hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
          ) : null
        }
      />

      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={previewUrl || ""}
        fileName={previewName || ""}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deleteError ? "No se puede eliminar" : "¿Eliminar gasto?"}
        description={
          deleteError
            ? deleteError
            : `¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.`
        }
        confirmText={deleteError ? "Entendido" : "Eliminar"}
        cancelText={deleteError ? "" : "Cancelar"}
        variant={deleteError ? "primary" : "danger"}
        icon={deleteError ? "error" : "delete"}
      />
    </>
  );
}

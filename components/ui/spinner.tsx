"use client";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Componente Spinner para estados de carga circulares.
 */
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-primary border-t-transparent 
        rounded-full animate-spin 
        ${className}
      `}
    />
  );
}

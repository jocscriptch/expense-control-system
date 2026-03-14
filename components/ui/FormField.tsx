"use client";

import React from "react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Input from "./Input";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  /** Extra content rendered between label and input (e.g. forgot password link) */
  labelExtra?: React.ReactNode;
}

export default function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  icon,
  autoComplete,
  maxLength,
  disabled,
  labelExtra,
}: FormFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-sm font-medium text-text-main dark:text-gray-200 block"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        icon={icon}
        autoComplete={autoComplete}
        maxLength={maxLength}
        disabled={disabled}
        error={error?.message}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}

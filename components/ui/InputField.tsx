'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function InputField({ label, id, className = "", ...props }: InputFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium text-muted uppercase tracking-wide">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:bg-primary-light/30 focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      />
    </div>
  );
}

export function TextAreaField({ label, id, className = "", ...props }: TextAreaFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium text-muted uppercase tracking-wide">
        {label}
      </label>
      <textarea
        id={inputId}
        rows={3}
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

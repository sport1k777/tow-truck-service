import type { ReactNode } from 'react';

interface BookingFormFieldProps {
  id: string;
  label: string;
  icon?: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function BookingFormField({
  id,
  label,
  icon,
  hint,
  error,
  required = false,
  children,
}: BookingFormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-white/80">
        {icon}
        {label}
        {required && (
          <span className="text-xs font-normal text-sky-400/80" aria-hidden="true">
            *
          </span>
        )}
        {!required && hint && (
          <span className="text-xs font-normal text-white/35">({hint})</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

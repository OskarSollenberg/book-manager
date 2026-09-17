import type { ComponentProps } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({
  id,
  label,
  error,
  hint,
  required,
  ...props
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition placeholder:text-text-tertiary focus:ring-2 ${
          error
            ? "border-danger focus:ring-danger/30"
            : "border-border focus:border-accent focus:ring-accent/30"
        }`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-text-tertiary">{hint}</p>
      )}
    </div>
  );
}

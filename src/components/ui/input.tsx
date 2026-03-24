import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  name: string;
}

export function Input({
  label,
  error,
  name,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5" data-testid={`input-${name}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-label font-semibold text-primary"
          data-testid={`input-${name}-label`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={[
          "transition-input w-full rounded-sm border bg-white px-3 py-2.5 text-body text-primary",
          "placeholder:text-gray-400",
          "focus:outline-none focus:shadow-focus",
          error
            ? "border-error focus:border-error"
            : "border-gray-200 focus:border-accent",
          "disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-testid={`input-${name}-field`}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-body-sm text-error"
          data-testid={`input-${name}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

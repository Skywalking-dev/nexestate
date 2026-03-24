"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
      data-testid="error-boundary"
    >
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold text-primary" data-testid="error-title">
          Algo salió mal
        </h2>
        <p className="text-sm text-muted-foreground" data-testid="error-message">
          Ocurrió un error inesperado. Si el problema persiste, contacta soporte.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground" data-testid="error-digest">
            Referencia: {error.digest}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        data-testid="error-retry-button"
      >
        Reintentar
      </button>
    </div>
  );
}

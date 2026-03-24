"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Root error boundary — catches errors in layout.tsx
// No Tailwind here: layout may not have loaded
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div
          style={{ textAlign: "center", padding: "2rem", maxWidth: "480px" }}
          data-testid="global-error-boundary"
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Algo salió mal
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa", marginBottom: "1.5rem" }}>
            Error crítico en la aplicación. Por favor recarga la página.
          </p>
          {error.digest && (
            <p
              style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a", marginBottom: "1rem" }}
              data-testid="global-error-digest"
            >
              Referencia: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#fafafa",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
            data-testid="global-error-retry-button"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}

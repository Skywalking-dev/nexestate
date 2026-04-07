"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type SyncState = "idle" | "loading" | "success" | "error";

export function SyncContactsButton() {
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSync() {
    setState("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/contacts/sync", { method: "POST" });
      const data: { synced?: number; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        setMessage(
          data.error ??
            `Error al sincronizar (${res.status}). Intenta nuevamente.`,
        );
        setState("error");
        return;
      }

      setMessage(
        typeof data.synced === "number"
          ? `${data.synced} ${data.synced === 1 ? "contacto sincronizado" : "contactos sincronizados"}.`
          : "Sincronización completada.",
      );
      setState("success");
      window.location.reload();
    } catch {
      setMessage("Error de red. Verifica tu conexión e intenta nuevamente.");
      setState("error");
    }
  }

  return (
    <div
      className="flex items-center gap-3"
      data-testid="contacts-sync-wrapper"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={state === "loading"}
        onClick={handleSync}
        data-testid="contacts-sync-button"
        aria-label="Sincronizar contactos desde CRM"
      >
        {state === "loading" ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="animate-spin"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Sincronizando...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Sincronizar
          </span>
        )}
      </Button>

      {message && (
        <output
          data-testid="contacts-sync-message"
          className={[
            "text-body-sm",
            state === "error" ? "text-error" : "text-accent",
          ].join(" ")}
        >
          {message}
        </output>
      )}
    </div>
  );
}

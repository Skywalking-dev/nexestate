"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CrmStatusResponse {
  connected: true;
  provider: string;
  status: string;
  last_sync_at: string | null;
  healthy: boolean;
}

type LoadState = "loading" | "ready" | "error";

const PROVIDER_LABELS: Record<string, string> = {
  tokko: "Tokko Broker",
  deinmobiliarios: "deinmobiliarios",
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Hace menos de un minuto";
  if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days !== 1 ? "s" : ""}`;
}

interface StatusBadgeProps {
  status: string;
  healthy: boolean;
}

function StatusBadge({ status, healthy }: StatusBadgeProps) {
  const isActive = status === "active" && healthy;
  const isError = status === "error" || (status === "active" && !healthy);

  const dotColor = isActive
    ? "bg-[#22C55E]"
    : isError
      ? "bg-[#EF4444]"
      : "bg-[#9CA3AF]";

  const label = isActive ? "Activo" : isError ? "Error" : "Desconectado";

  return (
    <span
      data-testid="crm-status-badge"
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5"
      aria-label={`Estado: ${label}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${dotColor}`}
        aria-hidden="true"
      />
      <span className="text-body-sm font-medium text-gray-700">{label}</span>
    </span>
  );
}

interface ConnectionStatusProps {
  onDisconnected: () => void;
}

export function ConnectionStatus({ onDisconnected }: ConnectionStatusProps) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [statusData, setStatusData] = useState<CrmStatusResponse | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/status");
      if (!res.ok) {
        setLoadState("error");
        return;
      }
      const data: { connected: boolean } & Partial<CrmStatusResponse> = await res.json();
      if (data.connected) {
        setStatusData(data as CrmStatusResponse);
        setLoadState("ready");
      } else {
        // Connection gone server-side — propagate up
        onDisconnected();
      }
    } catch {
      setLoadState("error");
    }
  }, [onDisconnected]);

  useEffect(() => {
    void fetchStatus();
    const interval = setInterval(() => void fetchStatus(), 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  async function handleDisconnect() {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres desconectar el CRM? Se perderá la sincronización activa.",
    );
    if (!confirmed) return;

    setDisconnecting(true);
    try {
      const res = await fetch("/api/crm/disconnect", { method: "DELETE" });
      if (res.ok) {
        onDisconnected();
      }
    } finally {
      setDisconnecting(false);
    }
  }

  if (loadState === "loading") {
    return (
      <div
        data-testid="crm-status"
        className="flex items-center gap-3 py-4 text-gray-500"
        aria-live="polite"
        aria-busy="true"
      >
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="text-body-sm">Verificando conexión...</span>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div
        data-testid="crm-status"
        className="flex flex-col gap-3 py-4"
        aria-live="polite"
      >
        <p className="text-body-sm text-error">
          No se pudo verificar el estado de la conexión.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setLoadState("loading");
            void fetchStatus();
          }}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (!statusData) return null;

  const providerLabel = PROVIDER_LABELS[statusData.provider] ?? statusData.provider;
  const lastSync = statusData.last_sync_at
    ? formatRelativeTime(statusData.last_sync_at)
    : null;

  return (
    <div
      data-testid="crm-status"
      className="flex flex-col gap-5"
      aria-live="polite"
    >
      {/* Provider + status row */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          data-testid="crm-status-provider"
          className="text-body font-medium text-primary"
        >
          {providerLabel}
        </span>
        <StatusBadge status={statusData.status} healthy={statusData.healthy} />
      </div>

      {/* Health indicator */}
      <div className="flex items-center gap-2">
        {statusData.healthy ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-body-sm text-gray-500">Conexión saludable</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-body-sm text-gray-500">
              Conexión con advertencias — verifica tu API key
            </span>
          </>
        )}
      </div>

      {/* Last sync */}
      <p
        data-testid="crm-status-last-sync"
        className="text-body-sm text-gray-400"
      >
        {lastSync
          ? `Última sincronización: ${lastSync}`
          : "Sin sincronizar aún"}
      </p>

      {/* Disconnect */}
      <div className="border-t border-gray-100 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          disabled={disconnecting}
          data-testid="crm-disconnect-button"
          aria-label="Desconectar CRM"
        >
          {disconnecting ? "Desconectando..." : "Desconectar CRM"}
        </Button>
      </div>
    </div>
  );
}

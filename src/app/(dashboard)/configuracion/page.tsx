"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ConnectForm } from "@/components/crm/connect-form";
import { ConnectionStatus } from "@/components/crm/connection-status";

// CRM connection state drives which panel renders.
// Initial state is unknown — ConnectionStatus fetches on mount.
// If status returns connected:false it calls onDisconnected → switches to form.
type CrmView = "status" | "form";

export default function ConfiguracionPage() {
  const [crmView, setCrmView] = useState<CrmView>("status");

  return (
    <div
      className="flex flex-col gap-8"
      data-testid="configuracion-page"
    >
      {/* Page heading */}
      <div data-testid="configuracion-header">
        <h1
          className="font-heading text-[36px] font-bold leading-[1.2] tracking-[-0.01em] text-primary"
          data-testid="configuracion-title"
        >
          Configuración
        </h1>
        <p className="mt-1 text-body text-gray-500">
          Administra las integraciones y preferencias de tu cuenta.
        </p>
      </div>

      {/* CRM section */}
      <section aria-label="Integración CRM" data-testid="configuracion-crm-section">
        <Card
          title="Integración CRM"
          data-testid="crm-section-card"
          className="max-w-xl"
        >
          <p className="mb-5 text-body-sm text-gray-500">
            Conecta tu CRM para sincronizar propiedades y contactos automáticamente.
          </p>

          {crmView === "status" ? (
            <ConnectionStatus
              onDisconnected={() => setCrmView("form")}
            />
          ) : (
            <ConnectForm
              onConnected={() => setCrmView("status")}
            />
          )}
        </Card>
      </section>
    </div>
  );
}

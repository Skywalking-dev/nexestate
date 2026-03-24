"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Provider = "tokko" | "deinmobiliarios";

const PROVIDERS: { value: Provider; label: string; disabled: boolean }[] = [
  { value: "tokko", label: "Tokko Broker", disabled: false },
  { value: "deinmobiliarios", label: "deinmobiliarios (Próximamente)", disabled: true },
];

type FormState = "idle" | "loading" | "error";

interface ConnectFormProps {
  onConnected: () => void;
}

export function ConnectForm({ onConnected }: ConnectFormProps) {
  const [provider, setProvider] = useState<Provider>("tokko");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSubmitDisabled = apiKey.trim().length < 10 || formState === "loading";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, api_key: apiKey }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Error al conectar el CRM. Intenta nuevamente.");
        setFormState("error");
        return;
      }

      onConnected();
    } catch {
      setErrorMsg("Error de red. Verifica tu conexión e intenta nuevamente.");
      setFormState("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="crm-connect-form"
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Provider select */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="crm-provider"
          className="text-label font-semibold text-primary"
        >
          Proveedor CRM
        </label>
        <select
          id="crm-provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value as Provider)}
          disabled={formState === "loading"}
          data-testid="crm-provider-select"
          className={[
            "w-full rounded-sm border border-gray-200 bg-white px-3 py-2.5",
            "text-body text-primary",
            "focus:outline-none focus:border-accent",
            "transition-[border-color] duration-200 ease-in-out",
            "disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
          ].join(" ")}
          aria-label="Seleccionar proveedor CRM"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value} disabled={p.disabled}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* API key input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="crm-api-key"
          className="text-label font-semibold text-primary"
        >
          API Key
        </label>
        <div className="relative">
          <input
            id="crm-api-key"
            name="api_key"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={formState === "loading"}
            placeholder="Ingresa tu API key de Tokko"
            autoComplete="off"
            data-testid="crm-api-key-input"
            aria-describedby={errorMsg ? "crm-connect-error" : undefined}
            aria-invalid={formState === "error"}
            className={[
              "w-full rounded-sm border bg-white px-3 py-2.5 pr-10",
              "text-body text-primary placeholder:text-gray-400",
              "focus:outline-none",
              "transition-[border-color] duration-200 ease-in-out",
              formState === "error"
                ? "border-error focus:border-error"
                : "border-gray-200 focus:border-accent",
              "disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400",
            ].join(" ")}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            disabled={formState === "loading"}
            data-testid="crm-api-key-toggle"
            aria-label={showKey ? "Ocultar API key" : "Mostrar API key"}
            className={[
              "absolute right-2.5 top-1/2 -translate-y-1/2",
              "flex h-6 w-6 items-center justify-center rounded",
              "text-gray-400 hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "transition-colors duration-150 ease-out",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
          >
            {showKey ? (
              /* Eye-off icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* Eye icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <p
          id="crm-connect-error"
          role="alert"
          data-testid="crm-connect-error"
          className="text-body-sm text-error"
        >
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitDisabled}
        data-testid="crm-connect-button"
        className="w-full sm:w-auto"
      >
        {formState === "loading" ? (
          <span className="flex items-center gap-2">
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
            Validando...
          </span>
        ) : (
          "Conectar CRM"
        )}
      </Button>
    </form>
  );
}

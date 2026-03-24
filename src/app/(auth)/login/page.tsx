"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { signInWithMagicLink } from "@/lib/supabase/auth";

type LoginState = "idle" | "loading" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    try {
      await signInWithMagicLink(email);
      setState("sent");
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Ocurrió un error. Intenta nuevamente."
      );
    }
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background px-4"
      data-testid="login-page"
    >
      <div
        className="w-full max-w-form"
        data-testid="login-container"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center" data-testid="login-logo">
          <Image
            src="/assets/logo-light.svg"
            alt="NexEstate"
            width={150}
            height={34}
            priority
          />
        </div>

        {/* Card */}
        <div
          className="rounded-md border border-gray-100 bg-white p-8"
          data-testid="login-card"
        >
          <h1
            className="mb-2 font-heading text-subheading font-semibold text-primary"
            data-testid="login-title"
          >
            Iniciar sesión
          </h1>
          <p
            className="mb-6 text-body-sm text-gray-500"
            data-testid="login-subtitle"
          >
            Ingresa tu email y te enviaremos un enlace de acceso.
          </p>

          {state === "sent" ? (
            <div
              className="rounded-md border border-success/20 bg-success/5 p-4 text-body-sm text-gray-700"
              data-testid="login-success"
              role="alert"
            >
              <p className="font-medium text-primary">Revisa tu email</p>
              <p className="mt-1 text-gray-600">
                Enviamos un enlace de acceso a{" "}
                <strong className="text-primary">{email}</strong>. Puede tardar
                unos minutos.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              data-testid="login-form"
            >
              {/* Email input */}
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-label font-semibold text-primary"
                  data-testid="login-email-label"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@agencia.com"
                  required
                  disabled={state === "loading"}
                  aria-describedby={
                    state === "error" ? "login-error-msg" : undefined
                  }
                  aria-invalid={state === "error"}
                  className="transition-input w-full rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-body text-primary placeholder:text-gray-400 focus:border-accent focus:shadow-focus focus:outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
                  data-testid="login-email-input"
                />
              </div>

              {/* Error */}
              {state === "error" && (
                <p
                  id="login-error-msg"
                  className="mb-4 text-body-sm text-error"
                  role="alert"
                  data-testid="login-error"
                >
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={state === "loading" || !email.trim()}
                className="transition-button w-full rounded-sm bg-accent px-4 py-2.5 text-body font-medium text-white hover:brightness-[0.85] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
                data-testid="login-submit"
              >
                {state === "loading" ? "Enviando..." : "Enviar enlace de acceso"}
              </button>
            </form>
          )}
        </div>

        <p
          className="mt-6 text-center text-caption text-gray-500"
          data-testid="login-footer"
        >
          © {new Date().getFullYear()} NexEstate. Todos los derechos
          reservados.
        </p>
      </div>
    </main>
  );
}

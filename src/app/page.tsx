import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4"
      data-testid="home-page"
    >
      <div
        className="flex flex-col items-center gap-8 text-center max-w-content"
        data-testid="home-hero"
      >
        {/* Logo */}
        <div data-testid="home-logo">
          <Image
            src="/assets/logo-light.svg"
            alt="NexEstate"
            width={180}
            height={40}
            priority
          />
        </div>

        {/* Tagline */}
        <div>
          <h1
            className="font-heading text-display font-bold text-primary"
            data-testid="home-tagline"
          >
            Tu inmobiliaria,{" "}
            <span className="text-accent">potenciada.</span>
          </h1>
          <p
            className="mt-4 text-body text-gray-600 max-w-form mx-auto"
            data-testid="home-description"
          >
            Inteligencia operativa para agencias inmobiliarias LATAM 5–30
            agentes.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3" data-testid="home-cta">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-body font-medium text-white transition-button hover:brightness-[0.85] focus-visible:outline-none"
            data-testid="home-cta-login"
          >
            Comenzar ahora
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-sm border border-gray-200 bg-gray-50 px-6 py-3 text-body font-medium text-primary transition-button hover:bg-gray-100 focus-visible:outline-none"
            data-testid="home-cta-demo"
          >
            Ver demo
          </Link>
        </div>
      </div>
    </main>
  );
}

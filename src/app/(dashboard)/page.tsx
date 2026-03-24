import { Card } from "@/components/ui/card";

const FEATURE_CARDS = [
  {
    title: "Propiedades",
    description: "Administra tu cartera de propiedades y sincroniza con tu CRM.",
    slug: "propiedades",
  },
  {
    title: "Contactos",
    description: "Gestiona leads y clientes en un solo lugar.",
    slug: "contactos",
  },
  {
    title: "Landings",
    description: "Crea landing pages para tus propiedades en minutos.",
    slug: "landings",
  },
  {
    title: "Chat IA",
    description: "Asistente inteligente para tu equipo de agentes.",
    slug: "chat-ia",
  },
] as const;

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-8" data-testid="dashboard-header">
        <h1
          className="font-heading text-heading font-bold text-primary"
          data-testid="dashboard-title"
        >
          Bienvenido a NexEstate
        </h1>
        <p
          className="mt-2 text-body text-gray-500"
          data-testid="dashboard-subtitle"
        >
          Tu plataforma de inteligencia operativa para agencias inmobiliarias.
        </p>
      </div>

      {/* Feature cards grid */}
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        data-testid="dashboard-features-grid"
      >
        {FEATURE_CARDS.map((feature) => (
          <Card
            key={feature.slug}
            title={feature.title}
            data-testid={`dashboard-feature-card-${feature.slug}`}
          >
            <p className="text-body-sm text-gray-600">{feature.description}</p>
            <p className="mt-4 text-caption text-gray-400">
              Próximamente disponible
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/auth";

export default async function DashboardPage() {
  // Best-effort count — no auth redirect here (layout handles it)
  let contactsCount: number | null = null;
  let propertiesCount: number | null = null;

  const user = await getUser();
  if (user) {
    const supabase = await createClient();
    const [contactsRes, propertiesRes] = await Promise.all([
      supabase.from("contacts").select("id", { count: "exact", head: true }),
      supabase.from("properties").select("id", { count: "exact", head: true }),
    ]);
    contactsCount = contactsRes.count ?? null;
    propertiesCount = propertiesRes.count ?? null;
  }

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
        <Card
          title="Propiedades"
          data-testid="dashboard-feature-card-propiedades"
        >
          <p className="text-body-sm text-gray-600">
            Administra tu cartera de propiedades y sincroniza con tu CRM.
          </p>
          {propertiesCount !== null ? (
            <p
              className="mt-4 text-caption font-medium text-accent"
              data-testid="dashboard-properties-count"
            >
              {propertiesCount}{" "}
              {propertiesCount === 1 ? "propiedad" : "propiedades"}
            </p>
          ) : (
            <p className="mt-4 text-caption text-gray-400">
              Próximamente disponible
            </p>
          )}
        </Card>

        <Card
          title="Contactos"
          data-testid="dashboard-feature-card-contactos"
        >
          <p className="text-body-sm text-gray-600">
            Gestiona leads y clientes en un solo lugar.
          </p>
          {contactsCount !== null ? (
            <p
              className="mt-4 text-caption font-medium text-accent"
              data-testid="dashboard-contacts-count"
            >
              {contactsCount}{" "}
              {contactsCount === 1 ? "contacto" : "contactos"}
            </p>
          ) : (
            <p className="mt-4 text-caption text-gray-400">
              Próximamente disponible
            </p>
          )}
        </Card>

        <Card
          title="Landings"
          data-testid="dashboard-feature-card-landings"
        >
          <p className="text-body-sm text-gray-600">
            Crea landing pages para tus propiedades en minutos.
          </p>
          <p className="mt-4 text-caption text-gray-400">
            Próximamente disponible
          </p>
        </Card>

        <Card
          title="Chat IA"
          data-testid="dashboard-feature-card-chat-ia"
        >
          <p className="text-body-sm text-gray-600">
            Asistente inteligente para tu equipo de agentes.
          </p>
          <p className="mt-4 text-caption text-gray-400">
            Próximamente disponible
          </p>
        </Card>
      </div>
    </div>
  );
}

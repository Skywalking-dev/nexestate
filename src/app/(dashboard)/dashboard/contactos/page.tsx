import { ContactTable } from "@/components/contacts/contact-table";
import { SyncContactsButton } from "@/components/contacts/sync-contacts-button";
import { requireAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ContactRow } from "@/lib/supabase/types";

export default async function ContactosPage() {
  await requireAuth();

  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("synced_at", { ascending: false });

  const items = (contacts ?? []) as ContactRow[];

  return (
    <div data-testid="contactos-page">
      {/* Header */}
      <div
        className="mb-8 flex items-center justify-between gap-4"
        data-testid="contactos-header"
      >
        <div>
          <h1
            className="font-heading text-heading font-bold text-primary"
            data-testid="contactos-title"
          >
            Contactos
          </h1>
          {items.length > 0 && (
            <p
              className="mt-1 text-body-sm text-gray-500"
              data-testid="contactos-count"
            >
              {items.length} {items.length === 1 ? "contacto" : "contactos"}
            </p>
          )}
        </div>
        <SyncContactsButton />
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-16 text-center"
          data-testid="contactos-empty-state"
        >
          {/* Person icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-gray-300"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
          </svg>
          <p
            className="text-body font-medium text-primary"
            data-testid="contactos-empty-title"
          >
            No hay contactos sincronizados
          </p>
          <p
            className="mt-1 text-body-sm text-gray-500"
            data-testid="contactos-empty-description"
          >
            Sincroniza tu CRM para comenzar.
          </p>
        </div>
      ) : (
        <ContactTable contacts={items} />
      )}
    </div>
  );
}

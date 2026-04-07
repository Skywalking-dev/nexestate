import type { ContactRow } from "@/lib/supabase/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "hace un momento";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

type TagItem = { id?: number; name?: string } | string;

function parseTags(raw: ContactRow["tags"]): string[] {
  if (!Array.isArray(raw)) return [];
  return (raw as TagItem[]).map((t) =>
    typeof t === "string" ? t : (t.name ?? ""),
  ).filter(Boolean);
}

// ── Component ──────────────────────────────────────────────────────────────────

interface ContactTableProps {
  contacts: ContactRow[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <div
      className="overflow-hidden rounded-md border border-gray-200 bg-white"
      data-testid="contact-table"
    >
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th
              className="px-4 py-3 font-medium text-gray-500"
              data-testid="contact-table-header-name"
            >
              Nombre
            </th>
            <th
              className="px-4 py-3 font-medium text-gray-500"
              data-testid="contact-table-header-email"
            >
              Email
            </th>
            <th
              className="px-4 py-3 font-medium text-gray-500"
              data-testid="contact-table-header-phone"
            >
              Teléfono
            </th>
            <th
              className="px-4 py-3 font-medium text-gray-500"
              data-testid="contact-table-header-tags"
            >
              Tags
            </th>
            <th
              className="px-4 py-3 font-medium text-gray-500"
              data-testid="contact-table-header-synced"
            >
              Sincronizado
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, idx) => {
            const tags = parseTags(contact.tags);
            const isLast = idx === contacts.length - 1;
            return (
              <tr
                key={contact.id}
                className={[
                  "transition-colors hover:bg-gray-50",
                  !isLast ? "border-b border-gray-100" : "",
                ].join(" ")}
                data-testid={`contact-row-${contact.id}`}
              >
                {/* Nombre */}
                <td
                  className="px-4 py-3 font-medium text-primary"
                  data-testid={`contact-name-${contact.id}`}
                >
                  {contact.name || <span className="text-gray-400">—</span>}
                </td>

                {/* Email */}
                <td
                  className="px-4 py-3"
                  data-testid={`contact-email-${contact.id}`}
                >
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-accent hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Teléfono */}
                <td
                  className="px-4 py-3"
                  data-testid={`contact-phone-${contact.id}`}
                >
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-gray-700 hover:text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Tags */}
                <td
                  className="px-4 py-3"
                  data-testid={`contact-tags-${contact.id}`}
                >
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded px-1.5 py-0.5 text-caption bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Sincronizado */}
                <td
                  className="px-4 py-3 text-gray-400"
                  data-testid={`contact-synced-${contact.id}`}
                >
                  {relativeTime(contact.synced_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

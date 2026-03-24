import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Propiedades", href: "/dashboard/propiedades", icon: "home" },
  { label: "Contactos", href: "/dashboard/contactos", icon: "users" },
  { label: "Landings", href: "/dashboard/landings", icon: "layout" },
  { label: "Chat IA", href: "/dashboard/chat-ia", icon: "message-circle" },
  { label: "Configuración", href: "/dashboard/configuracion", icon: "settings" },
] as const;

// Minimal inline icon using SVG paths (no external icon lib dependency)
function NavIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    users:
      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    layout:
      "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M3 9h18 M9 21V9",
    "message-circle":
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    settings:
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? ""} />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside
      className="hidden w-60 flex-col border-r border-gray-100 bg-primary md:flex"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div
        className="flex h-14 items-center px-6 border-b border-white/10"
        data-testid="sidebar-logo"
      >
        <Image
          src="/assets/logo-dark.svg"
          alt="NexEstate"
          width={130}
          height={30}
          priority
        />
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-col gap-1 px-3 py-4"
        aria-label="Navegación principal"
        data-testid="sidebar-nav"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium text-white/70 no-underline transition-button hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            data-testid={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

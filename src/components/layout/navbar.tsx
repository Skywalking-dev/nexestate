import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const userInitial = user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6"
      data-testid="navbar"
    >
      {/* Logo — visible on mobile (sidebar hidden) */}
      <div className="md:hidden" data-testid="navbar-logo-mobile">
        <Image
          src="/assets/logo-light.svg"
          alt="NexEstate"
          width={120}
          height={28}
          priority
        />
      </div>

      {/* Spacer — desktop: sidebar takes left space */}
      <div className="hidden md:block" aria-hidden="true" />

      {/* User menu */}
      <div
        className="flex items-center gap-3"
        data-testid="navbar-user-menu"
      >
        <span
          className="hidden text-body-sm text-gray-600 sm:block"
          data-testid="navbar-user-email"
        >
          {user.email}
        </span>
        <button
          type="button"
          aria-label="Menú de usuario"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-caption font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          data-testid="navbar-user-avatar"
        >
          {userInitial}
        </button>
      </div>
    </header>
  );
}

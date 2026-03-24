import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function Card({
  title,
  children,
  className = "",
  "data-testid": testId,
}: CardProps) {
  const derivedTestId = testId ?? (title ? `card-${slugify(title)}` : "card");

  return (
    <div
      className={[
        // Surface 1: white + 8px radius + 1px gray-100 border (PRODUCT_IDENTITY.md § Elevation)
        "rounded-md border border-gray-100 bg-white p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid={derivedTestId}
    >
      {title && (
        <h3
          className="mb-3 font-heading text-subheading font-semibold text-primary"
          data-testid={`${derivedTestId}-title`}
        >
          {title}
        </h3>
      )}
      <div data-testid={`${derivedTestId}-body`}>{children}</div>
    </div>
  );
}

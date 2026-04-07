"use client";

import { useState, type FormEvent } from "react";
import { type Property, PropertyCard } from "@/components/properties/property-card";
import type { SearchFilters } from "@/lib/search-parser";

interface SearchResult {
  filters: SearchFilters;
  results: Property[];
  count: number;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  AP: "Departamento",
  HO: "Casa",
  LA: "Terreno",
  LO: "Local",
  PH: "PH",
};

const OPERATION_TYPE_LABELS: Record<string, string> = {
  Sale: "Venta",
  Rent: "Alquiler",
  Temporary: "Temporal",
};

function FilterPills({ filters }: { filters: SearchFilters }) {
  const pills: string[] = [];
  if (filters.property_type) pills.push(PROPERTY_TYPE_LABELS[filters.property_type] ?? filters.property_type);
  if (filters.operation_type) pills.push(OPERATION_TYPE_LABELS[filters.operation_type] ?? filters.operation_type);
  if (filters.min_price != null || filters.max_price != null) {
    const cur = filters.currency ?? "USD";
    if (filters.min_price != null && filters.max_price != null) {
      pills.push(`${cur} ${filters.min_price.toLocaleString()}–${filters.max_price.toLocaleString()}`);
    } else if (filters.max_price != null) {
      pills.push(`Hasta ${cur} ${filters.max_price.toLocaleString()}`);
    } else {
      pills.push(`Desde ${cur} ${filters.min_price!.toLocaleString()}`);
    }
  }
  if (filters.min_bedrooms != null) pills.push(`${filters.min_bedrooms}+ dormitorios`);
  if (filters.min_bathrooms != null) pills.push(`${filters.min_bathrooms}+ baños`);
  if (filters.min_surface != null) pills.push(`${filters.min_surface}+ m²`);
  if (filters.address_contains) pills.push(filters.address_contains);

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" data-testid="search-filter-pills">
      {pills.map((pill) => (
        <span
          key={pill}
          className="rounded-sm bg-accent/10 px-2.5 py-1 text-caption font-medium text-accent"
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

export function AISearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/search/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as SearchResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="ai-search">
      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-3" data-testid="ai-search-form">
        <div className="relative flex-1">
          {/* Search icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: departamento 3 ambientes en Palermo hasta 200k USD"
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-body text-primary placeholder:text-gray-400 transition-input focus:outline-none focus:border-accent focus:shadow-focus"
            disabled={loading}
            data-testid="ai-search-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-body font-medium text-white transition-button hover:brightness-[0.85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
          data-testid="ai-search-submit"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-body-sm text-red-700"
          role="alert"
          data-testid="ai-search-error"
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6" data-testid="ai-search-results">
          {/* Filters applied + count */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <FilterPills filters={result.filters} />
            <p className="text-body-sm text-gray-500" data-testid="ai-search-count">
              {result.count === 0
                ? "Sin resultados"
                : `${result.count} ${result.count === 1 ? "propiedad encontrada" : "propiedades encontradas"}`}
            </p>
          </div>

          {/* Empty state */}
          {result.count === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-12 text-center"
              data-testid="ai-search-empty"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 text-gray-300"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M8 11h6" />
              </svg>
              <p className="text-body font-medium text-primary">No se encontraron propiedades</p>
              <p className="mt-1 text-body-sm text-gray-500">
                Intenta con otros criterios de búsqueda.
              </p>
            </div>
          ) : (
            /* Results grid */
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              data-testid="ai-search-grid"
            >
              {result.results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hint when no search yet */}
      {!result && !loading && !error && (
        <div
          className="mt-8 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-12 text-center"
          data-testid="ai-search-hint"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3 text-gray-300"
            aria-hidden="true"
          >
            <path d="M9.663 17h4.674M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 11 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z" />
          </svg>
          <p className="text-body font-medium text-primary">Busca propiedades con lenguaje natural</p>
          <p className="mt-1 text-body-sm text-gray-500">
            Describe lo que buscas: tipo, zona, precio, ambientes, superficie...
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "Departamento 2 ambientes en Palermo",
              "Casa con pileta hasta 300k USD",
              "Oficina en microcentro",
              "Terreno más de 500m²",
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-1.5 text-caption text-gray-600 transition-button hover:border-accent hover:text-accent"
                data-testid="ai-search-example"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

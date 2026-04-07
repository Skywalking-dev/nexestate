/**
 * Regex-based property search parser — zero external dependencies.
 * Parses Spanish natural language queries into structured filters.
 */

export interface SearchFilters {
  property_type?: string;
  operation_type?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  min_surface?: number;
  max_surface?: number;
  address_contains?: string;
  keywords?: string;
}

// Property type patterns → CRM codes
const PROPERTY_TYPES: [RegExp, string][] = [
  [/\b(?:depto|departamento|dpto|apartamento|ap)\b/i, "AP"],
  [/\b(?:casa|chalet|vivienda)\b/i, "HO"],
  [/\b(?:terreno|lote|tierra|parcela)\b/i, "LA"],
  [/\b(?:local|comercial)\b/i, "LO"],
  [/\b(?:ph|penthouse)\b/i, "PH"],
];

// Operation type patterns → CRM codes
const OPERATION_TYPES: [RegExp, string][] = [
  [/\b(?:alquil\w*|renta|arrend\w*)\b/i, "Rent"],
  [/\b(?:venta|comprar|compra|vender)\b/i, "Sale"],
  [/\b(?:tempor\w*)\b/i, "Temporary"],
];

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/\./g, "").replace(",", ".");
  return Number.parseFloat(cleaned);
}

function expandMultiplier(value: number, suffix?: string): number {
  if (!suffix) return value;
  const s = suffix.toLowerCase();
  if (s === "k") return value * 1000;
  if (s === "m" || s === "mm" || s === "mill" || s === "millon" || s === "millones") return value * 1_000_000;
  return value;
}

export function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  let remaining = query;

  // Property type
  for (const [pattern, code] of PROPERTY_TYPES) {
    if (pattern.test(query)) {
      filters.property_type = code;
      remaining = remaining.replace(pattern, "");
      break;
    }
  }

  // Operation type
  for (const [pattern, code] of OPERATION_TYPES) {
    if (pattern.test(query)) {
      filters.operation_type = code;
      remaining = remaining.replace(pattern, "");
      break;
    }
  }

  // Ambientes → bedrooms (ambientes - 1)
  const ambMatch = query.match(/(\d+)\s*(?:ambientes?|amb\.?)\b/i);
  if (ambMatch) {
    const amb = Number.parseInt(ambMatch[1]!);
    filters.min_bedrooms = Math.max(amb - 1, 0);
    remaining = remaining.replace(ambMatch[0]!, "");
  }

  // Dormitorios/habitaciones
  if (filters.min_bedrooms == null) {
    const bedMatch = query.match(/(\d+)\s*(?:dormitorios?|habitaciones?|dorm\.?|cuartos?)\b/i);
    if (bedMatch) {
      filters.min_bedrooms = Number.parseInt(bedMatch[1]!);
      remaining = remaining.replace(bedMatch[0]!, "");
    }
  }

  // Baños
  const bathMatch = query.match(/(\d+)\s*(?:ba[nñ]os?|ban|bath)\b/i);
  if (bathMatch) {
    filters.min_bathrooms = Number.parseInt(bathMatch[1]!);
    remaining = remaining.replace(bathMatch[0]!, "");
  }

  // Superficie
  const surfMatch = query.match(/(\d+)\s*(?:m2|m²|metros?(?:\s*cuadrados?)?)\b/i);
  if (surfMatch) {
    filters.min_surface = Number.parseInt(surfMatch[1]!);
    remaining = remaining.replace(surfMatch[0]!, "");
  }

  const surfMaxMatch = query.match(/hasta\s*(\d+)\s*(?:m2|m²|metros?)\b/i);
  if (surfMaxMatch) {
    filters.max_surface = Number.parseInt(surfMaxMatch[1]!);
    filters.min_surface = undefined; // "hasta" overrides min
  }

  // Currency detection
  const hasPesos = /\bpesos?\b|\bars\b|\b\$\s*(?!u)/i.test(query);
  const hasUsd = /\busd\b|\bu\$s\b|\bdolar|dólar/i.test(query);
  if (hasPesos) filters.currency = "ARS";
  else if (hasUsd) filters.currency = "USD";

  // Price: "hasta X" → max_price
  const maxPriceMatch = query.match(
    /hasta\s*(?:u\$s|usd|\$)?\s*(\d+(?:[.,]\d+)?)\s*(k|m|mm|mill(?:on(?:es)?)?)?(?!\s*(?:m2|m²|metros?))/i,
  );
  if (maxPriceMatch) {
    filters.max_price = expandMultiplier(parseNumber(maxPriceMatch[1]!), maxPriceMatch[2]);
    remaining = remaining.replace(maxPriceMatch[0]!, "");
  }

  // Price: "desde X" → min_price
  const minPriceMatch = query.match(
    /desde\s*(?:u\$s|usd|\$)?\s*(\d+(?:[.,]\d+)?)\s*(k|m|mm|mill(?:on(?:es)?)?)?/i,
  );
  if (minPriceMatch) {
    filters.min_price = expandMultiplier(parseNumber(minPriceMatch[1]!), minPriceMatch[2]);
    remaining = remaining.replace(minPriceMatch[0]!, "");
  }

  // Price: standalone number with multiplier (e.g. "200k", "1m")
  if (filters.max_price == null && filters.min_price == null) {
    const standalonePriceMatch = query.match(
      /(?:u\$s|usd|\$)\s*(\d+(?:[.,]\d+)?)\s*(k|m|mm|mill(?:on(?:es)?)?)?/i,
    );
    if (standalonePriceMatch) {
      filters.max_price = expandMultiplier(parseNumber(standalonePriceMatch[1]!), standalonePriceMatch[2]);
      remaining = remaining.replace(standalonePriceMatch[0]!, "");
    }
  }

  // Location: "en <location>" pattern
  const locationMatch = remaining.match(/\ben\s+([a-záéíóúñü\s]+?)(?:\s*$|\s+(?:hasta|desde|con|de)\b)/i);
  if (locationMatch) {
    const loc = locationMatch[1]!.trim();
    if (loc.length >= 3) {
      filters.address_contains = loc;
    }
  }

  // Remaining meaningful words as keywords (after removing noise)
  const noise = /\b(?:en|de|con|el|la|los|las|un|una|y|o|que|por|para|mas|más|menos|sin|al|del)\b/gi;
  const cleaned = remaining.replace(noise, "").replace(/\s+/g, " ").trim();
  if (cleaned.length >= 3 && !filters.address_contains) {
    // If we didn't extract a location and there's leftover text, use as keywords
    filters.keywords = cleaned;
  }

  return filters;
}

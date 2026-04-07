/**
 * POST /api/search/properties
 * Property search — natural language query → structured filters → Supabase query.
 * Strategy controlled by SEARCH_MODE env var: "ai" (DeepSeek) or "parser" (regex, default).
 * Requires: authenticated user (any role).
 */
import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { parseSearchQuery, type SearchFilters } from "@/lib/search-parser";
import { extractFiltersWithAI } from "@/lib/search-ai";

type SearchMode = "ai" | "parser";
const SEARCH_MODE: SearchMode =
  process.env.SEARCH_MODE === "ai" ? "ai" : "parser";

function sanitizeForLike(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const query =
    typeof (body as Record<string, unknown>)?.query === "string"
      ? ((body as Record<string, unknown>).query as string)
      : undefined;

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "Se requiere un texto de búsqueda." },
      { status: 400 },
    );
  }

  // Get user's org
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("members")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!member?.org_id) {
    return NextResponse.json(
      { error: "No perteneces a ninguna organización." },
      { status: 403 },
    );
  }

  // Extract filters — strategy depends on feature flag
  let filters: SearchFilters;
  if (SEARCH_MODE === "ai") {
    filters = await extractFiltersWithAI(query);
  } else {
    filters = parseSearchQuery(query);
  }

  // Build Supabase query
  let dbQuery = supabase
    .from("properties")
    .select("*")
    .eq("org_id", member.org_id)
    .order("price", { ascending: true, nullsFirst: false });

  if (filters.property_type) {
    dbQuery = dbQuery.eq("property_type", filters.property_type);
  }
  if (filters.operation_type) {
    dbQuery = dbQuery.eq("operation_type", filters.operation_type);
  }
  if (filters.min_price != null) {
    dbQuery = dbQuery.gte("price", filters.min_price);
  }
  if (filters.max_price != null) {
    dbQuery = dbQuery.lte("price", filters.max_price);
  }
  if (filters.currency) {
    dbQuery = dbQuery.eq("currency", filters.currency);
  }
  if (filters.min_bedrooms != null) {
    dbQuery = dbQuery.gte("bedrooms", filters.min_bedrooms);
  }
  if (filters.max_bedrooms != null) {
    dbQuery = dbQuery.lte("bedrooms", filters.max_bedrooms);
  }
  if (filters.min_bathrooms != null) {
    dbQuery = dbQuery.gte("bathrooms", filters.min_bathrooms);
  }
  if (filters.min_surface != null) {
    dbQuery = dbQuery.gte("surface_total", filters.min_surface);
  }
  if (filters.max_surface != null) {
    dbQuery = dbQuery.lte("surface_total", filters.max_surface);
  }
  if (filters.address_contains) {
    dbQuery = dbQuery.ilike("address", `%${sanitizeForLike(filters.address_contains)}%`);
  }
  if (filters.keywords) {
    const safe = sanitizeForLike(filters.keywords);
    dbQuery = dbQuery.or(
      `title.ilike.%${safe}%,description.ilike.%${safe}%`,
    );
  }

  dbQuery = dbQuery.limit(20);

  const { data: properties, error: dbError } = await dbQuery;

  if (dbError) {
    console.error("Property search DB error:", dbError);
    return NextResponse.json(
      { error: "Error al buscar propiedades." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    mode: SEARCH_MODE,
    filters,
    results: properties ?? [],
    count: properties?.length ?? 0,
  });
}

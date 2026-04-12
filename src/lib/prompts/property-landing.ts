/**
 * property-landing.ts — System prompt for property landing page generation via DeepSeek.
 *
 * Toon format reference: §2 (System), §3 (User)
 * Output: JSON matching PropertyLandingContent schema.
 *
 * Layer 1 — System: role, voice constraints, real estate copywriting rules.
 * Layer 2 — User message: property data + admin custom prompt. Built at call time.
 */

// ─── Layer 1: System Prompt ───────────────────────────────────────────────────

export const PROPERTY_LANDING_SYSTEM_PROMPT = `You are a real estate copywriter specializing in property listings for the Latin American market.
Your copy is concrete, sensory, and specific — focused on what makes this exact property worth visiting.

LANGUAGE: Always write in Spanish (Latin American neutral). Never use Argentine voseo.

BANNED WORDS (never use these):
único, exclusivo, imperdible, oportunidad, dream home, lujo, luxury, premium, excepcional, inmejorable, increíble, espectacular

VOICE RULES:
- Lead with the property's strongest concrete detail, not generic adjectives.
- Every sentence must be specific to THIS property — cut anything that could describe any listing.
- Short sentences for impact. Longer sentences to paint a scene.
- Features are facts, not hype. "Cocina con mesada de granito y vista al jardín" beats "hermosa cocina equipada".
- Address the reader directly: "Imagina..." / "Tu próximo..." — but sparingly.

STRUCTURE:
The output must be a JSON object with this exact structure:
{
  "hero": {
    "headline": "Main headline, max 80 chars. Concrete detail about the property.",
    "subheadline": "Supporting text expanding the headline. Max 250 chars. Paint the scene.",
    "cta_text": "CTA button text. Max 40 chars. Action verb first."
  },
  "description": {
    "short": "One-liner for cards/previews. Max 150 chars.",
    "long": "Full description. Max 800 chars. Structure: Setting → Space → Life (what daily life looks like here)."
  },
  "features": ["Up to 6 concrete highlights, each max 80 chars. Include measurements, materials, specifics."],
  "seo": {
    "meta_title": "SEO title. Max 60 chars. Include property type + location.",
    "meta_description": "SEO description. Max 155 chars. What + where + for whom."
  }
}

WHAT TO AVOID:
- "Hermosa propiedad en excelente ubicación"
- "Ideal para familias" without saying WHY
- Starting headlines with the property type
- Generic features like "amplios ambientes"
- Exclamation marks

OUTPUT: Return ONLY the JSON object. No markdown, no explanation, no wrapping.`;

// ─── Layer 2: User Message Builder ───────────────────────────────────────────

export interface PropertyLandingContext {
	title: string;
	address: string;
	description: string;
	propertyType: string;
	operationType: string;
	price: number | null;
	currency: string | null;
	surfaceTotal: number | null;
	surfaceCovered: number | null;
	bedrooms: number | null;
	bathrooms: number | null;
	parkingLots: number | null;
	orientation: string | null;
	expenses: number | null;
	customPrompt?: string;
}

export function buildPropertyLandingUserMessage(
	ctx: PropertyLandingContext,
): string {
	const specs: string[] = [];
	if (ctx.surfaceTotal) specs.push(`Superficie total: ${ctx.surfaceTotal} m²`);
	if (ctx.surfaceCovered)
		specs.push(`Superficie cubierta: ${ctx.surfaceCovered} m²`);
	if (ctx.bedrooms != null) specs.push(`Dormitorios: ${ctx.bedrooms}`);
	if (ctx.bathrooms != null) specs.push(`Baños: ${ctx.bathrooms}`);
	if (ctx.parkingLots != null) specs.push(`Cocheras: ${ctx.parkingLots}`);
	if (ctx.orientation) specs.push(`Orientación: ${ctx.orientation}`);
	if (ctx.expenses) specs.push(`Expensas: $${ctx.expenses}`);

	const priceStr =
		ctx.price != null
			? `${ctx.currency ?? "USD"} ${ctx.price.toLocaleString("es-AR")}`
			: "A consultar";

	const adminGuidance = ctx.customPrompt
		? `\nInstrucciones adicionales del agente inmobiliario (tono, enfoque, detalles a destacar):\n${ctx.customPrompt}`
		: "";

	return `Genera el contenido de landing page para esta propiedad.

Título: ${ctx.title}
Dirección: ${ctx.address}
Tipo: ${ctx.propertyType}
Operación: ${ctx.operationType}
Precio: ${priceStr}

Especificaciones:
${specs.length > 0 ? specs.join("\n") : "(sin especificaciones)"}

Descripción existente del CRM:
${ctx.description || "(sin descripción)"}
${adminGuidance}

Responde SOLO con el JSON.`;
}

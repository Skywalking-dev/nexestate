import { chatCompletion } from "@/lib/deepseek";
import {
	PROPERTY_LANDING_SYSTEM_PROMPT,
	buildPropertyLandingUserMessage,
} from "@/lib/prompts/property-landing";
import {
	generateLandingRequestSchema,
	isPropertyLandingContent,
	propertyLandingContentSchema,
} from "@/lib/schemas/property-landing";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";
/**
 * POST /api/properties/[id]/generate-landing
 * Generates a landing page for a property using DeepSeek.
 * Requires: authenticated + admin role.
 */
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id: propertyId } = await params;

	// 1. Auth
	let orgId: string;
	try {
		const admin = await requireAdmin();
		orgId = admin.orgId;
	} catch (err) {
		const e = err as { status?: number; error?: string };
		if (e.status === 403)
			return NextResponse.json({ error: e.error }, { status: 403 });
		return NextResponse.json({ error: "No autorizado." }, { status: 401 });
	}

	// 2. Parse request
	let customPrompt: string | undefined;
	try {
		const body = await request.json();
		const parsed = generateLandingRequestSchema.parse(body);
		customPrompt = parsed.custom_prompt;
	} catch {
		return NextResponse.json(
			{ error: "Formato de solicitud inválido." },
			{ status: 400 },
		);
	}

	// 3. Fetch property
	const supabase = await createClient();
	const { data: property, error: propError } = await supabase
		.from("properties")
		.select("*")
		.eq("id", propertyId)
		.eq("org_id", orgId)
		.single();

	if (propError || !property) {
		return NextResponse.json(
			{ error: "Propiedad no encontrada." },
			{ status: 404 },
		);
	}

	// 4. Build prompt + call DeepSeek
	const userMessage = buildPropertyLandingUserMessage({
		title: property.title,
		address: property.address,
		description: property.description,
		propertyType: property.property_type,
		operationType: property.operation_type,
		price: property.price,
		currency: property.currency,
		surfaceTotal: property.surface_total,
		surfaceCovered: property.surface_covered,
		bedrooms: property.bedrooms,
		bathrooms: property.bathrooms,
		parkingLots: property.parking_lot_amount,
		orientation: property.orientation || null,
		expenses: property.expenses,
		customPrompt,
	});

	let rawContent: string;
	try {
		rawContent = await chatCompletion(
			[
				{ role: "system", content: PROPERTY_LANDING_SYSTEM_PROMPT },
				{ role: "user", content: userMessage },
			],
			{ temperature: 0.7, maxTokens: 1024, json: true, timeoutMs: 30_000 },
		);
	} catch (err) {
		console.error("[generate-landing] DeepSeek error", err);
		return NextResponse.json(
			{ error: "Error al generar contenido." },
			{ status: 502 },
		);
	}

	// 5. Parse + validate
	let content: unknown;
	try {
		content = JSON.parse(rawContent);
	} catch {
		console.error("[generate-landing] Invalid JSON from DeepSeek:", rawContent);
		return NextResponse.json(
			{ error: "Respuesta inválida del modelo." },
			{ status: 502 },
		);
	}

	if (!isPropertyLandingContent(content)) {
		console.error("[generate-landing] Content failed type guard:", content);
		return NextResponse.json(
			{ error: "Estructura de contenido inválida." },
			{ status: 502 },
		);
	}

	const validated = propertyLandingContentSchema.safeParse(content);
	if (!validated.success) {
		console.error(
			"[generate-landing] Zod validation failed:",
			validated.error.issues,
		);
		return NextResponse.json(
			{ error: "Contenido excede límites de caracteres." },
			{ status: 502 },
		);
	}

	// 6. Generate slug + persist
	const slug = slugify(property.title);

	const { data: landing, error: insertError } = await supabase
		.from("property_landings")
		.insert({
			property_id: propertyId,
			org_id: orgId,
			content: validated.data as unknown as import("@/lib/supabase/types").Json,
			custom_prompt: customPrompt ?? null,
			slug,
			status: "draft",
		})
		.select()
		.single();

	if (insertError) {
		console.error("[generate-landing] Insert error:", insertError);
		return NextResponse.json(
			{ error: "Error al guardar la landing." },
			{ status: 500 },
		);
	}

	return NextResponse.json({ landing }, { status: 201 });
}

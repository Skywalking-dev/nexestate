import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
/**
 * POST /api/properties/[id]/publish-landing
 * Publishes the most recent draft landing for a property.
 * Unpublishes any previously published landing for the same property.
 * Requires: authenticated + admin role.
 */
import { NextResponse } from "next/server";

export async function POST(
	_request: Request,
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

	const supabase = await createClient();

	// 2. Get most recent draft landing
	const { data: landing, error: fetchError } = await supabase
		.from("property_landings")
		.select("id")
		.eq("property_id", propertyId)
		.eq("org_id", orgId)
		.eq("status", "draft")
		.order("generated_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (fetchError) {
		console.error("[publish-landing] fetch error", fetchError);
		return NextResponse.json(
			{ error: "Error al buscar landing." },
			{ status: 500 },
		);
	}
	if (!landing) {
		return NextResponse.json(
			{ error: "No hay landing en borrador para publicar." },
			{ status: 404 },
		);
	}

	// 3. Unpublish any existing published landing for this property
	await supabase
		.from("property_landings")
		.update({ status: "draft", published_at: null })
		.eq("property_id", propertyId)
		.eq("org_id", orgId)
		.eq("status", "published");

	// 4. Publish the draft
	const { data: published, error: updateError } = await supabase
		.from("property_landings")
		.update({ status: "published", published_at: new Date().toISOString() })
		.eq("id", landing.id)
		.select()
		.single();

	if (updateError) {
		console.error("[publish-landing] update error", updateError);
		return NextResponse.json({ error: "Error al publicar." }, { status: 500 });
	}

	return NextResponse.json({ landing: published });
}

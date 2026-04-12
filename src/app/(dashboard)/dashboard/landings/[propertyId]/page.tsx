import { LandingEditor } from "@/components/landings/landing-editor";
import type { PropertyLandingContent } from "@/lib/schemas/property-landing";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
/**
 * Landing editor page — /dashboard/landings/[propertyId]
 * Server component that fetches property data and existing landing,
 * then renders the client-side editor.
 */
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ propertyId: string }>;
}

export default async function LandingEditorPage({ params }: PageProps) {
	const { propertyId } = await params;

	let orgId: string;
	try {
		const admin = await requireAdmin();
		orgId = admin.orgId;
	} catch {
		notFound();
	}

	const supabase = await createClient();

	// Fetch property
	const { data: property } = await supabase
		.from("properties")
		.select("id, title, price, currency, photos")
		.eq("id", propertyId)
		.eq("org_id", orgId)
		.single();

	if (!property) notFound();

	// Fetch most recent landing (any status)
	const { data: landingRow } = await supabase
		.from("property_landings")
		.select("id, content, status, slug")
		.eq("property_id", propertyId)
		.eq("org_id", orgId)
		.order("generated_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	const existingLanding = landingRow
		? {
				id: landingRow.id as string,
				content: landingRow.content as unknown as PropertyLandingContent,
				status: landingRow.status as string,
				slug: landingRow.slug as string,
			}
		: null;

	const photos = Array.isArray(property.photos)
		? (property.photos as Array<{ image: string; thumb: string }>)
		: null;

	return (
		<LandingEditor
			property={{
				id: property.id,
				title: property.title,
				price: property.price,
				currency: property.currency,
				photos,
			}}
			existingLanding={existingLanding}
		/>
	);
}

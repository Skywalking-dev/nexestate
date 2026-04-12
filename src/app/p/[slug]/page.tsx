import { PropertyLanding } from "@/components/landings/property-landing";
import type { PropertyLandingContent } from "@/lib/schemas/property-landing";
import { createServiceClient } from "@/lib/supabase/service";
import type { Metadata } from "next";
/**
 * Public property landing page — /p/[slug]
 * Serves published landings with ISR (1h revalidation).
 * Uses service-role client to bypass RLS (no auth required).
 */
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface PageProps {
	params: Promise<{ slug: string }>;
}

async function getLanding(slug: string) {
	const supabase = createServiceClient();

	const { data: landing } = await supabase
		.from("property_landings")
		.select(
			"id, content, slug, property_id, properties(title, price, currency, photos)",
		)
		.eq("slug", slug)
		.eq("status", "published")
		.single();

	return landing;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const landing = await getLanding(slug);

	if (!landing) return { title: "Propiedad no encontrada" };

	const content = landing.content as unknown as PropertyLandingContent;
	const property = landing.properties as unknown as {
		title: string;
		photos: Array<{ image: string }> | null;
	};

	return {
		title: content.seo.meta_title,
		description: content.seo.meta_description,
		openGraph: {
			title: content.seo.meta_title,
			description: content.seo.meta_description,
			images: property?.photos?.[0]?.image ? [property.photos[0].image] : [],
		},
	};
}

export default async function PublicLandingPage({ params }: PageProps) {
	const { slug } = await params;
	const landing = await getLanding(slug);

	if (!landing) notFound();

	const content = landing.content as unknown as PropertyLandingContent;
	const property = landing.properties as unknown as {
		title: string;
		price: number | null;
		currency: string | null;
		photos: Array<{ image: string; thumb: string }> | null;
	};

	const heroImage = property?.photos?.[0]?.image ?? null;
	const price = property?.price
		? `${property.currency ?? "USD"} ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(property.price)}`
		: "Precio a consultar";

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-4xl px-6 py-12">
				<PropertyLanding
					content={content}
					propertyTitle={property?.title ?? ""}
					heroImage={heroImage}
					price={price}
				/>

				{/* Contact section anchor */}
				<section
					id="contacto"
					className="mt-16 rounded-md border border-gray-200 bg-white p-8 text-center"
					data-testid="landing-contact"
				>
					<h2 className="font-heading text-subheading font-semibold text-primary mb-2">
						Consulta por esta propiedad
					</h2>
					<p className="text-body-sm text-gray-500 mb-6">
						Completa el formulario y un agente se pondrá en contacto.
					</p>
					<form
						className="mx-auto flex max-w-md flex-col gap-3"
						data-testid="landing-contact-form"
					>
						<input
							type="text"
							name="name"
							placeholder="Nombre"
							required
							className="rounded-sm border border-gray-200 px-4 py-2.5 text-body-sm transition-input focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							required
							className="rounded-sm border border-gray-200 px-4 py-2.5 text-body-sm transition-input focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
						/>
						<input
							type="tel"
							name="phone"
							placeholder="Teléfono"
							className="rounded-sm border border-gray-200 px-4 py-2.5 text-body-sm transition-input focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
						/>
						<button
							type="submit"
							className="rounded-sm bg-accent px-6 py-2.5 text-body font-medium text-white transition-button hover:brightness-[0.85]"
						>
							Enviar consulta
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}

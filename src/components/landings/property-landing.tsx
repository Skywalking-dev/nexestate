/**
 * PropertyLanding — renders the generated landing content.
 * Used in both dashboard preview and public route.
 */
import type { PropertyLandingContent } from "@/lib/schemas/property-landing";

interface PropertyLandingProps {
	content: PropertyLandingContent;
	propertyTitle: string;
	heroImage: string | null;
	price: string;
}

export function PropertyLanding({
	content,
	propertyTitle,
	heroImage,
	price,
}: PropertyLandingProps) {
	return (
		<article className="mx-auto max-w-3xl" data-testid="property-landing">
			{/* Hero */}
			<section data-testid="property-landing-hero">
				{heroImage && (
					<div className="mb-6 overflow-hidden rounded-md">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={heroImage}
							alt={propertyTitle}
							className="h-80 w-full object-cover"
						/>
					</div>
				)}
				<h1
					className="font-heading text-heading font-bold text-primary"
					data-testid="property-landing-headline"
				>
					{content.hero.headline}
				</h1>
				<p
					className="mt-3 text-body text-gray-600 leading-relaxed"
					data-testid="property-landing-subheadline"
				>
					{content.hero.subheadline}
				</p>
				<p className="mt-4 font-heading text-subheading font-semibold text-accent">
					{price}
				</p>
			</section>

			{/* Description */}
			<section className="mt-10" data-testid="property-landing-description">
				<p className="text-body text-gray-700 leading-relaxed whitespace-pre-line">
					{content.description.long}
				</p>
			</section>

			{/* Features */}
			{content.features.length > 0 && (
				<section className="mt-10" data-testid="property-landing-features">
					<h2 className="font-heading text-subheading font-semibold text-primary mb-4">
						Características
					</h2>
					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{content.features.map((feature, i) => (
							<li
								key={i}
								className="flex items-start gap-2 rounded-sm border border-gray-200 bg-white px-4 py-3 text-body-sm text-gray-700"
								data-testid={`property-landing-feature-${i}`}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="mt-0.5 shrink-0 text-accent"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
								{feature}
							</li>
						))}
					</ul>
				</section>
			)}

			{/* CTA */}
			<section
				className="mt-10 rounded-md border border-gray-200 bg-white p-8 text-center"
				data-testid="property-landing-cta"
			>
				<p className="text-body text-gray-600 mb-4">
					{content.description.short}
				</p>
				<a
					href="#contacto"
					className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-body font-medium text-white transition-button hover:brightness-[0.85]"
					data-testid="property-landing-cta-button"
				>
					{content.hero.cta_text}
				</a>
			</section>
		</article>
	);
}

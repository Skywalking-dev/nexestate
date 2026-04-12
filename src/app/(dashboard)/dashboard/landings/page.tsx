import type { PropertyLandingContent } from "@/lib/schemas/property-landing";
/**
 * Landings list page — /dashboard/landings
 * Shows all generated landings with status and links to edit/view.
 */
import { requireAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

interface LandingRow {
	id: string;
	property_id: string;
	content: PropertyLandingContent;
	status: string;
	slug: string;
	generated_at: string;
	published_at: string | null;
	properties: { title: string; photos: Array<{ thumb: string }> | null } | null;
}

export default async function LandingsPage() {
	await requireAuth();

	const supabase = await createClient();
	const { data: landings } = await supabase
		.from("property_landings")
		.select(
			"id, property_id, content, status, slug, generated_at, published_at, properties(title, photos)",
		)
		.order("generated_at", { ascending: false });

	const items = (landings ?? []) as unknown as LandingRow[];

	return (
		<div data-testid="landings-page">
			<div className="mb-8">
				<h1 className="font-heading text-heading font-bold text-primary">
					Landings
				</h1>
				<p className="mt-2 text-body-sm text-gray-500">
					Landings generadas para tus propiedades. Genera nuevas desde el panel
					de propiedades.
				</p>
			</div>

			{items.length === 0 ? (
				<div
					className="rounded-md border border-gray-200 bg-white p-8 text-center"
					data-testid="landings-empty"
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mx-auto mb-4 text-gray-300"
						aria-hidden="true"
					>
						<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
						<path d="M3 9h18" />
						<path d="M9 21V9" />
					</svg>
					<p className="text-body font-medium text-primary">
						No hay landings generadas
					</p>
					<p className="mt-1 text-body-sm text-gray-500">
						Ve al panel de propiedades y usa el botón &quot;Generar
						Landing&quot; en cualquier tarjeta.
					</p>
				</div>
			) : (
				<div className="space-y-3" data-testid="landings-list">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between rounded-md border border-gray-100 bg-white px-5 py-4 transition-shadow hover:shadow-sm"
							data-testid={`landing-item-${item.id}`}
						>
							<div className="flex items-center gap-4">
								{/* Thumbnail */}
								<div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-100">
									{item.properties?.photos?.[0]?.thumb ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={item.properties.photos[0].thumb}
											alt=""
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-gray-300">
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												aria-hidden="true"
											>
												<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
											</svg>
										</div>
									)}
								</div>

								<div>
									<p className="text-body font-medium text-primary">
										{item.content?.hero?.headline ??
											item.properties?.title ??
											"Sin título"}
									</p>
									<p className="text-caption text-gray-400">
										{new Date(item.generated_at).toLocaleDateString("es-AR", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<span
									className={`rounded-sm px-2 py-0.5 text-caption font-medium ${
										item.status === "published"
											? "bg-success/10 text-success"
											: "bg-gray-100 text-gray-500"
									}`}
								>
									{item.status === "published" ? "Publicada" : "Borrador"}
								</span>

								<a
									href={`/dashboard/landings/${item.property_id}`}
									className="text-body-sm font-medium text-accent no-underline hover:underline"
								>
									Editar
								</a>

								{item.status === "published" && (
									<a
										href={`/p/${item.slug}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-body-sm text-gray-500 no-underline hover:text-accent"
									>
										Ver →
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

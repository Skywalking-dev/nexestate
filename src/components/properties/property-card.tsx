interface PropertyPhoto {
	image: string;
	thumb: string;
	order: number;
	original: string;
}

export interface Property {
	id: string;
	title: string;
	address: string | null;
	price: number | null;
	currency: string | null;
	property_type: string | null;
	operation_type: string | null;
	surface_total: number | null;
	surface_covered: number | null;
	bedrooms: number | null;
	bathrooms: number | null;
	photos: PropertyPhoto[] | null;
	status: string | null;
	synced_at: string | null;
}

function formatPrice(price: number | null, currency: string | null): string {
	if (!price) return "Precio a consultar";
	const formatted = new Intl.NumberFormat("es-AR", {
		maximumFractionDigits: 0,
	}).format(price);
	return `${currency ?? "USD"} ${formatted}`;
}

interface PropertyCardProps {
	property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
	const thumb = property.photos?.[0]?.thumb ?? null;
	const testId = `property-card-${property.id}`;

	return (
		<div
			className="rounded-md border border-gray-100 bg-white overflow-hidden transition-shadow duration-200 hover:shadow-sm flex flex-col"
			data-testid={testId}
		>
			{/* Thumbnail */}
			<div
				className="h-40 w-full bg-gray-100 overflow-hidden"
				data-testid={`${testId}-thumbnail`}
			>
				{thumb ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={thumb}
						alt={property.title}
						className="h-full w-full object-cover"
						loading="lazy"
					/>
				) : (
					<div
						className="flex h-full w-full items-center justify-center"
						aria-label="Sin imagen"
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-gray-300"
							aria-hidden="true"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="m21 15-5-5L5 21" />
						</svg>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 p-4" data-testid={`${testId}-content`}>
				{/* Title + type */}
				<div className="mb-1 flex items-start justify-between gap-2">
					<h3
						className="font-heading text-subheading font-semibold text-primary line-clamp-1"
						data-testid={`${testId}-title`}
					>
						{property.title}
					</h3>
					{property.operation_type && (
						<span
							className="shrink-0 rounded-sm bg-accent/10 px-2 py-0.5 text-caption font-medium text-accent"
							data-testid={`${testId}-operation-type`}
						>
							{property.operation_type}
						</span>
					)}
				</div>

				{/* Address */}
				{property.address && (
					<p
						className="mb-3 text-body-sm text-gray-500 line-clamp-1"
						data-testid={`${testId}-address`}
					>
						{property.address}
					</p>
				)}

				{/* Price */}
				<p
					className="mb-3 text-body font-semibold text-primary"
					data-testid={`${testId}-price`}
				>
					{formatPrice(property.price, property.currency)}
				</p>

				{/* Pills */}
				<div className="flex flex-wrap gap-1.5" data-testid={`${testId}-pills`}>
					{property.property_type && (
						<span
							className="rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-500"
							data-testid={`${testId}-pill-type`}
						>
							{property.property_type}
						</span>
					)}
					{property.bedrooms != null && (
						<span
							className="flex items-center gap-1 rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-500"
							data-testid={`${testId}-pill-bedrooms`}
						>
							{/* Bed icon */}
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 16h20M6 8v-1" />
							</svg>
							{property.bedrooms}
						</span>
					)}
					{property.bathrooms != null && (
						<span
							className="flex items-center gap-1 rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-500"
							data-testid={`${testId}-pill-bathrooms`}
						>
							{/* Drop icon */}
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
							</svg>
							{property.bathrooms}
						</span>
					)}
					{property.surface_total != null && (
						<span
							className="flex items-center gap-1 rounded-sm border border-gray-200 px-2 py-0.5 text-caption text-gray-500"
							data-testid={`${testId}-pill-surface`}
						>
							{/* Square icon */}
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<rect x="3" y="3" width="18" height="18" rx="1" />
							</svg>
							{property.surface_total} m²
						</span>
					)}
				</div>
			</div>

			{/* Generate Landing link */}
			<div className="border-t border-gray-100 px-4 py-2" data-testid={`${testId}-landing-action`}>
				<a
					href={`/dashboard/landings/${property.id}`}
					className="flex items-center gap-1.5 text-caption font-medium text-accent no-underline hover:brightness-[0.85] transition-button"
					data-testid={`${testId}-generate-landing`}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
						<path d="M3 9h18" />
						<path d="M9 21V9" />
					</svg>
					Generar Landing
				</a>
			</div>
		</div>
	);
}

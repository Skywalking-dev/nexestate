/**
 * Generates a URL-safe slug from a string.
 * Appends a short random suffix for uniqueness.
 */
export function slugify(text: string): string {
	const base = text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // strip accents
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 60);

	const suffix = Math.random().toString(36).slice(2, 7);
	return `${base}-${suffix}`;
}

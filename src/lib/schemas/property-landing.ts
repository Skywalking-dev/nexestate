/**
 * Zod schemas for property landing generation.
 * Validates LLM output and API requests.
 */
import { z } from "zod";

// ── Landing content (LLM output) ────────────────────────────────────────────

export const propertyLandingContentSchema = z.object({
	hero: z.object({
		headline: z.string().max(80),
		subheadline: z.string().max(250),
		cta_text: z.string().max(40),
	}),
	description: z.object({
		short: z.string().max(150),
		long: z.string().max(800),
	}),
	features: z.array(z.string().max(80)).max(6),
	seo: z.object({
		meta_title: z.string().max(60),
		meta_description: z.string().max(155),
	}),
});

export type PropertyLandingContent = z.infer<
	typeof propertyLandingContentSchema
>;

// ── API request schemas ─────────────────────────────────────────────────────

export const generateLandingRequestSchema = z.object({
	custom_prompt: z.string().max(1000).optional(),
});

export type GenerateLandingRequest = z.infer<
	typeof generateLandingRequestSchema
>;

// ── Type guard ──────────────────────────────────────────────────────────────

export function isPropertyLandingContent(
	v: unknown,
): v is PropertyLandingContent {
	return (
		typeof v === "object" &&
		v !== null &&
		"hero" in v &&
		"description" in v &&
		"features" in v &&
		"seo" in v
	);
}

"use client";

import { PropertyLanding } from "@/components/landings/property-landing";
import { Button } from "@/components/ui/button";
import type { PropertyLandingContent } from "@/lib/schemas/property-landing";
/**
 * LandingEditor — dashboard component for generating and previewing property landings.
 * Contains prompt textarea, generate/publish buttons, and live preview.
 */
import { useState } from "react";

interface PropertyData {
	id: string;
	title: string;
	price: number | null;
	currency: string | null;
	photos: Array<{ image: string; thumb: string }> | null;
}

interface LandingData {
	id: string;
	content: PropertyLandingContent;
	status: string;
	slug: string;
}

const DEFAULT_PROMPT =
	"Genera una landing atractiva que destaque las mejores características de esta propiedad.";

function formatPrice(price: number | null, currency: string | null): string {
	if (!price) return "Precio a consultar";
	const formatted = new Intl.NumberFormat("es-AR", {
		maximumFractionDigits: 0,
	}).format(price);
	return `${currency ?? "USD"} ${formatted}`;
}

export function LandingEditor({
	property,
	existingLanding,
}: { property: PropertyData; existingLanding: LandingData | null }) {
	const [customPrompt, setCustomPrompt] = useState(DEFAULT_PROMPT);
	const [landing, setLanding] = useState<LandingData | null>(existingLanding);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const heroImage = property.photos?.[0]?.image ?? null;
	const price = formatPrice(property.price, property.currency);

	async function handleGenerate() {
		setIsGenerating(true);
		setError(null);

		try {
			const res = await fetch(
				`/api/properties/${property.id}/generate-landing`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ custom_prompt: customPrompt || undefined }),
				},
			);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? "Error al generar");
			}

			const data = await res.json();
			setLanding(data.landing);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setIsGenerating(false);
		}
	}

	async function handlePublish() {
		if (!landing) return;
		setIsPublishing(true);
		setError(null);

		try {
			const res = await fetch(
				`/api/properties/${property.id}/publish-landing`,
				{
					method: "POST",
				},
			);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? "Error al publicar");
			}

			const data = await res.json();
			setLanding(data.landing);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setIsPublishing(false);
		}
	}

	return (
		<div
			className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]"
			data-testid="landing-editor"
		>
			{/* Left: Controls (narrow sidebar) */}
			<div className="space-y-5" data-testid="landing-editor-controls">
				<div>
					<h1
						className="font-heading text-subheading font-bold text-primary"
						data-testid="landing-editor-title"
					>
						Generar Landing
					</h1>
					<p className="mt-0.5 text-caption text-gray-500 line-clamp-1">
						{property.title}
					</p>
				</div>

				{/* Prompt */}
				<div>
					<label
						htmlFor="custom-prompt"
						className="block text-caption font-medium text-primary mb-1.5"
					>
						Instrucciones
					</label>
					<textarea
						id="custom-prompt"
						value={customPrompt}
						onChange={(e) => setCustomPrompt(e.target.value)}
						maxLength={1000}
						rows={5}
						className="w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-body-sm text-primary transition-input focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none resize-none"
						placeholder="Ej: Enfocarse en la vista al lago y la cercanía al centro..."
						data-testid="landing-editor-prompt"
					/>
					<p className="mt-0.5 text-right text-caption text-gray-300">
						{customPrompt.length}/1000
					</p>
				</div>

				{/* Actions */}
				<div
					className="flex flex-col gap-2"
					data-testid="landing-editor-actions"
				>
					<Button
						onClick={handleGenerate}
						disabled={isGenerating}
						className="w-full"
						data-testid="landing-editor-generate-btn"
					>
						{isGenerating
							? "Generando..."
							: landing
								? "Regenerar"
								: "Generar Landing"}
					</Button>

					{landing && landing.status === "draft" && (
						<Button
							variant="secondary"
							onClick={handlePublish}
							disabled={isPublishing}
							className="w-full"
							data-testid="landing-editor-publish-btn"
						>
							{isPublishing ? "Publicando..." : "Publicar"}
						</Button>
					)}
				</div>

				{/* Status */}
				{landing && (
					<div
						className="flex items-center gap-2 flex-wrap"
						data-testid="landing-editor-status"
					>
						<span
							className={`inline-flex rounded-sm px-2 py-0.5 text-caption font-medium ${
								landing.status === "published"
									? "bg-success/10 text-success"
									: "bg-gray-100 text-gray-500"
							}`}
						>
							{landing.status === "published" ? "Publicada" : "Borrador"}
						</span>
						{landing.status === "published" && (
							<a
								href={`/p/${landing.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-caption text-accent no-underline hover:underline"
								data-testid="landing-editor-public-link"
							>
								Ver pública →
							</a>
						)}
					</div>
				)}

				{/* Error */}
				{error && (
					<p
						className="rounded-sm border border-error/20 bg-error/5 px-3 py-2 text-caption text-error"
						data-testid="landing-editor-error"
					>
						{error}
					</p>
				)}
			</div>

			{/* Right: Preview (takes remaining space) */}
			<div
				className="rounded-md border border-gray-100 bg-white shadow-sm overflow-y-auto max-h-[calc(100vh-7rem)]"
				data-testid="landing-editor-preview"
			>
				{landing ? (
					<div className="p-8">
						<PropertyLanding
							content={landing.content}
							propertyTitle={property.title}
							heroImage={heroImage}
							price={price}
						/>
					</div>
				) : (
					<div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-gray-300">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
							<path d="M3 9h18" />
							<path d="M9 21V9" />
						</svg>
						<p className="text-body-sm">La preview aparece al generar</p>
					</div>
				)}
			</div>
		</div>
	);
}

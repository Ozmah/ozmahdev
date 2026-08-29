import { CheckIcon } from "@phosphor-icons/react/Check";
import { CopyIcon } from "@phosphor-icons/react/Copy";
import { DownloadSimpleIcon } from "@phosphor-icons/react/DownloadSimple";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-field";
import {
	canvasToPngBlob,
	defaultOgImageContent,
	OG_IMAGE_FILE_NAME,
	OG_IMAGE_HEIGHT,
	OG_IMAGE_WIDTH,
	type OgImageContent,
	renderOgImage,
} from "./og-image-renderer";

type GeneratorStatus = "copied" | "downloaded" | "error" | "idle";

export function OgImageGenerator() {
	const [content, setContent] = useState(defaultOgImageContent);
	const [isRendering, setIsRendering] = useState(true);
	const [status, setStatus] = useState<GeneratorStatus>("idle");
	const [error, setError] = useState("");
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		let cancelled = false;
		setIsRendering(true);

		void renderOgImage(canvas, content)
			.then(() => {
				if (!cancelled) {
					setIsRendering(false);
					setStatus("idle");
					setError("");
				}
			})
			.catch((renderError: unknown) => {
				if (!cancelled) {
					setIsRendering(false);
					setStatus("error");
					setError(getErrorMessage(renderError));
				}
			});

		return () => {
			cancelled = true;
		};
	}, [content]);

	function updateContent<Key extends keyof OgImageContent>(
		key: Key,
		value: OgImageContent[Key],
	) {
		setContent((current) => ({ ...current, [key]: value }));
	}

	async function preparePng() {
		const canvas = canvasRef.current;

		if (!canvas) {
			throw new Error("The OG image preview is not ready.");
		}

		await renderOgImage(canvas, content);
		return canvasToPngBlob(canvas);
	}

	async function copyPng() {
		try {
			if (!window.isSecureContext || !navigator.clipboard?.write) {
				throw new Error(
					"Image copy requires a secure browser context. Download the PNG instead.",
				);
			}

			if (typeof ClipboardItem === "undefined") {
				throw new Error(
					"This browser cannot copy PNG files. Download the image instead.",
				);
			}

			setIsRendering(true);
			const png = await preparePng();
			const plainText = `${content.siteTitle}\nHi, I'm ${content.name}.\n${content.tagline}`;

			await navigator.clipboard.write([
				new ClipboardItem({
					"image/png": png,
					"text/plain": new Blob([plainText], { type: "text/plain" }),
				}),
			]);

			setStatus("copied");
			setError("");
		} catch (copyError) {
			setStatus("error");
			setError(getErrorMessage(copyError));
		} finally {
			setIsRendering(false);
		}
	}

	async function downloadPng() {
		try {
			setIsRendering(true);
			const png = await preparePng();
			const url = URL.createObjectURL(png);
			const link = document.createElement("a");
			link.download = OG_IMAGE_FILE_NAME;
			link.href = url;
			link.click();
			URL.revokeObjectURL(url);
			setStatus("downloaded");
			setError("");
		} catch (downloadError) {
			setStatus("error");
			setError(getErrorMessage(downloadError));
		} finally {
			setIsRendering(false);
		}
	}

	const statusMessage =
		status === "copied"
			? "PNG copied. Paste it into any app that accepts images."
			: status === "downloaded"
				? `Downloaded ${OG_IMAGE_FILE_NAME}.`
				: status === "error"
					? error
					: `${OG_IMAGE_WIDTH} × ${OG_IMAGE_HEIGHT} PNG`;

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
			<div className="min-w-0">
				<canvas
					aria-label={`OG image preview for ${content.siteTitle}`}
					className="block h-auto w-full border border-border-strong bg-background"
					height={OG_IMAGE_HEIGHT}
					ref={canvasRef}
					role="img"
					width={OG_IMAGE_WIDTH}
				>
					{content.siteTitle}. Hi, I'm {content.name}. {content.tagline}
				</canvas>
				<p className="mt-3 mb-0 font-oz-mono text-dim text-xs leading-5">
					The preview is scaled to fit. Copy and download always use the full
					1200 × 630 canvas.
				</p>
			</div>

			<aside className="border border-border-strong bg-surface p-5">
				<h3 className="m-0 font-oz-mono text-accent text-sm uppercase tracking-wider">
					Image content
				</h3>
				<div className="mt-5 grid gap-1">
					<TextInput
						label="Site title"
						maxLength={24}
						onChange={(event) => updateContent("siteTitle", event.target.value)}
						value={content.siteTitle}
					/>
					<TextInput
						label="Name"
						maxLength={32}
						onChange={(event) => updateContent("name", event.target.value)}
						value={content.name}
					/>
					<TextInput
						label="Tagline"
						maxLength={72}
						onChange={(event) => updateContent("tagline", event.target.value)}
						value={content.tagline}
					/>
				</div>

				<div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
					<Button
						className="min-h-12 min-w-0 px-4 py-3"
						disabled={isRendering}
						icon={
							status === "copied" ? (
								<CheckIcon aria-hidden="true" size={20} />
							) : (
								<CopyIcon aria-hidden="true" size={20} />
							)
						}
						onClick={() => void copyPng()}
					>
						{status === "copied" ? "Copied" : "Copy PNG"}
					</Button>
					<Button
						className="min-h-12 min-w-0 px-4 py-3"
						disabled={isRendering}
						icon={<DownloadSimpleIcon aria-hidden="true" size={20} />}
						onClick={() => void downloadPng()}
						variant="secondary"
					>
						Download
					</Button>
				</div>

				<p
					aria-live="polite"
					className={`mt-4 mb-0 min-h-10 font-oz-mono text-xs leading-5 ${
						status === "error" ? "text-accent-strong" : "text-dim"
					}`}
				>
					{statusMessage}
				</p>
			</aside>
		</div>
	);
}

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: "The image could not be generated.";
}

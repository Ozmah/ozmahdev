import { CheckIcon } from "@phosphor-icons/react/Check";
import { CopyIcon } from "@phosphor-icons/react/Copy";
import { DownloadSimpleIcon } from "@phosphor-icons/react/DownloadSimple";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/react/ui/button";
import { RangeField } from "../../components/react/ui/range-field";
import { TextInput } from "../../components/react/ui/text-field";
import {
	canvasToReceiptPng,
	copyReceiptToClipboard,
	createReceiptFileName,
	downloadReceiptPng,
} from "./receipt-exporter";
import {
	defaultReceiptContent,
	defaultReceiptPresentation,
	loadReceiptFonts,
	RECEIPT_CANVAS_HEIGHT,
	RECEIPT_CANVAS_WIDTH,
	type ReceiptContent,
	renderReceipt,
} from "./receipt-renderer";

type ReceiptActionStatus =
	| "copied"
	| "downloaded"
	| "error"
	| "idle"
	| "text-copied";

export function ReceiptGenerator() {
	const [content, setContent] = useState(defaultReceiptContent);
	const [rotationDegrees, setRotationDegrees] = useState(
		defaultReceiptPresentation.rotationDegrees,
	);
	const [renderError, setRenderError] = useState("");
	const [actionError, setActionError] = useState("");
	const [actionStatus, setActionStatus] = useState<ReceiptActionStatus>("idle");
	const [isPreparing, setIsPreparing] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		let cancelled = false;

		void loadReceiptFonts()
			.then(() => {
				if (cancelled) {
					return;
				}

				renderReceipt(canvas, content, { rotationDegrees });
				setRenderError("");
				setActionError("");
				setActionStatus("idle");
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setRenderError(getErrorMessage(error));
				}
			});

		return () => {
			cancelled = true;
		};
	}, [content, rotationDegrees]);

	function updateContent<Key extends keyof ReceiptContent>(
		key: Key,
		value: ReceiptContent[Key],
	) {
		setContent((current) => ({ ...current, [key]: value }));
	}

	async function preparePng() {
		await loadReceiptFonts();
		const exportCanvas = document.createElement("canvas");
		renderReceipt(exportCanvas, content, { rotationDegrees });
		return canvasToReceiptPng(exportCanvas);
	}

	async function copyPng() {
		try {
			setIsPreparing(true);
			const png = await preparePng();
			const result = await copyReceiptToClipboard(png, content);
			setActionStatus(result === "image" ? "copied" : "text-copied");
			setActionError("");
		} catch (error) {
			setActionStatus("error");
			setActionError(getErrorMessage(error));
		} finally {
			setIsPreparing(false);
		}
	}

	async function downloadPng() {
		try {
			setIsPreparing(true);
			const png = await preparePng();
			downloadReceiptPng(png, content.receiptNumber);
			setActionStatus("downloaded");
			setActionError("");
		} catch (error) {
			setActionStatus("error");
			setActionError(getErrorMessage(error));
		} finally {
			setIsPreparing(false);
		}
	}

	const fileName = createReceiptFileName(content.receiptNumber);
	const actionMessage = getActionMessage(actionStatus, actionError, fileName);

	return (
		<div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)]">
			<div className="min-w-0">
				<div className="overflow-hidden border border-border-strong bg-background">
					<canvas
						aria-label={`Receipt preview for ${content.customerName}`}
						className="h-auto w-full"
						height={RECEIPT_CANVAS_HEIGHT}
						ref={canvasRef}
						role="img"
						width={RECEIPT_CANVAS_WIDTH}
					>
						{`Receipt from ${content.businessName} for ${content.customerName}, total ${content.totalCents / 100} ${content.currency}.`}
					</canvas>
				</div>

				<div className="mt-3 flex flex-wrap items-start justify-between gap-2 font-oz-mono text-base/6 text-dim sm:text-sm/5">
					<p className="m-0">Live Canvas preview</p>
					<p className="m-0 tabular-nums">
						{RECEIPT_CANVAS_WIDTH} × {RECEIPT_CANVAS_HEIGHT} px
					</p>
				</div>

				<p
					aria-live="polite"
					className="mt-2 min-h-6 text-pretty font-oz-mono text-base/6 text-accent-strong sm:text-sm/5"
				>
					{renderError}
				</p>
			</div>

			<aside className="border border-border-strong bg-surface p-5">
				<div className="grid gap-1">
					<h3 className="m-0 text-balance font-oz-mono text-sm uppercase tracking-wide text-accent">
						Receipt controls
					</h3>
					<p className="m-0 text-pretty text-base/7 text-muted sm:text-sm/6">
						Edit the data, then rotate the pixels that will become the final
						image.
					</p>
				</div>

				<div className="mt-5 grid gap-x-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
					<TextInput
						label="Business"
						maxLength={48}
						name="receipt-business"
						onChange={(event) =>
							updateContent("businessName", event.currentTarget.value)
						}
						value={content.businessName}
					/>
					<TextInput
						label="Customer"
						maxLength={64}
						name="receipt-customer"
						onChange={(event) =>
							updateContent("customerName", event.currentTarget.value)
						}
						value={content.customerName}
					/>
					<TextInput
						label="Description"
						maxLength={72}
						name="receipt-description"
						onChange={(event) =>
							updateContent("description", event.currentTarget.value)
						}
						value={content.description}
					/>
					<TextInput
						inputMode="decimal"
						label="Total (MXN)"
						min={0}
						name="receipt-total"
						onChange={(event) => {
							const total = event.currentTarget.valueAsNumber;

							updateContent(
								"totalCents",
								Number.isFinite(total)
									? Math.max(0, Math.round(total * 100))
									: 0,
							);
						}}
						step="0.01"
						type="number"
						value={content.totalCents / 100}
					/>
					<TextInput
						label="Date"
						name="receipt-date"
						onChange={(event) =>
							updateContent("issuedOn", event.currentTarget.value)
						}
						type="date"
						value={content.issuedOn}
					/>
					<TextInput
						label="Receipt number"
						maxLength={32}
						name="receipt-number"
						onChange={(event) =>
							updateContent("receiptNumber", event.currentTarget.value)
						}
						value={content.receiptNumber}
					/>
				</div>

				<div className="grid gap-5 border-border border-t pt-5">
					<RangeField
						description="The transform is rendered into Canvas—not applied with CSS."
						label="Paper rotation"
						max={6}
						min={-6}
						name="receipt-rotation"
						onValueChange={setRotationDegrees}
						unit="°"
						value={rotationDegrees}
					/>

					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
						<Button
							className="min-h-12 min-w-0 px-4 py-3"
							disabled={isPreparing}
							icon={
								actionStatus === "copied" || actionStatus === "text-copied" ? (
									<CheckIcon aria-hidden="true" size={20} />
								) : (
									<CopyIcon aria-hidden="true" size={20} />
								)
							}
							onClick={() => void copyPng()}
						>
							{actionStatus === "copied" || actionStatus === "text-copied"
								? "Copied"
								: "Copy PNG"}
						</Button>
						<Button
							className="min-h-12 min-w-0 px-4 py-3"
							disabled={isPreparing}
							icon={<DownloadSimpleIcon aria-hidden="true" size={20} />}
							onClick={() => void downloadPng()}
							variant="secondary"
						>
							Download
						</Button>
					</div>

					<p
						aria-live="polite"
						className={`m-0 min-h-10 text-pretty font-oz-mono text-base/6 sm:text-sm/5 ${
							actionStatus === "error" ? "text-accent-strong" : "text-dim"
						}`}
					>
						{actionMessage}
					</p>
				</div>
			</aside>
		</div>
	);
}

function getErrorMessage(error: unknown) {
	return error instanceof Error
		? error.message
		: "The receipt preview could not be rendered.";
}

function getActionMessage(
	status: ReceiptActionStatus,
	error: string,
	fileName: string,
) {
	switch (status) {
		case "copied":
			return "PNG and receipt text copied.";
		case "text-copied":
			return "Image copy unavailable; receipt text copied instead.";
		case "downloaded":
			return `Downloaded ${fileName}.`;
		case "error":
			return error;
		case "idle":
			return `${RECEIPT_CANVAS_WIDTH} × ${RECEIPT_CANVAS_HEIGHT} PNG`;
	}
}

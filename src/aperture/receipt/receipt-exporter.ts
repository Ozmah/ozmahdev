import type { ReceiptContent } from "./receipt-renderer";

export type ReceiptCopyResult = "image" | "text";

export function canvasToReceiptPng(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("The browser could not encode the receipt as PNG."));
				return;
			}

			resolve(blob);
		}, "image/png");
	});
}

export async function copyReceiptToClipboard(
	png: Blob,
	content: ReceiptContent,
): Promise<ReceiptCopyResult> {
	const plainText = createReceiptText(content);

	if (
		window.isSecureContext &&
		navigator.clipboard?.write &&
		typeof ClipboardItem !== "undefined"
	) {
		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"image/png": png,
					"text/plain": new Blob([plainText], { type: "text/plain" }),
				}),
			]);

			return "image";
		} catch {
			// Some browsers expose rich clipboard APIs but reject image MIME types.
		}
	}

	if (!window.isSecureContext || !navigator.clipboard?.writeText) {
		throw new Error(
			"Clipboard access requires HTTPS. Download the PNG instead.",
		);
	}

	await navigator.clipboard.writeText(plainText);
	return "text";
}

export function downloadReceiptPng(png: Blob, receiptNumber: string) {
	const url = URL.createObjectURL(png);
	const link = document.createElement("a");
	link.download = createReceiptFileName(receiptNumber);
	link.href = url;
	link.hidden = true;
	document.body.append(link);
	link.click();
	link.remove();

	setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function createReceiptFileName(receiptNumber: string) {
	const safeReceiptNumber = receiptNumber
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);

	return `receipt-${safeReceiptNumber || "sale"}.png`;
}

function createReceiptText(content: ReceiptContent) {
	const totalCents =
		Number.isSafeInteger(content.totalCents) && content.totalCents >= 0
			? content.totalCents
			: 0;
	const total = new Intl.NumberFormat("en-US", {
		currency: content.currency,
		style: "currency",
	}).format(totalCents / 100);
	const parsedDate = new Date(`${content.issuedOn}T12:00:00Z`);
	const date = Number.isNaN(parsedDate.getTime())
		? "Date unavailable"
		: new Intl.DateTimeFormat("en-US", {
				dateStyle: "medium",
				timeZone: "UTC",
			}).format(parsedDate);

	return [
		oneLine(content.businessName, 48, "Sales receipt"),
		"SALE RECEIPT",
		"",
		`Total: ${total}`,
		`Customer: ${oneLine(content.customerName, 64, "Walk-in customer")}`,
		`Description: ${oneLine(content.description, 72, "General sale")}`,
		`Date: ${date}`,
		`Receipt no.: ${oneLine(content.receiptNumber, 32, "UNASSIGNED")}`,
	].join("\n");
}

function oneLine(value: string, maxLength: number, fallback: string) {
	return value.replace(/\s+/g, " ").trim().slice(0, maxLength) || fallback;
}

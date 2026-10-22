export const RECEIPT_CANVAS_WIDTH = 1200;
export const RECEIPT_CANVAS_HEIGHT = 630;

export interface ReceiptContent {
	businessName: string;
	currency: "MXN" | "USD";
	customerName: string;
	description: string;
	issuedOn: string;
	receiptNumber: string;
	totalCents: number;
}

export interface ReceiptPresentation {
	rotationDegrees: number;
}

export const defaultReceiptContent: ReceiptContent = {
	businessName: "Northstar Supply",
	currency: "MXN",
	customerName: "Morgan Reyes",
	description: "Workshop equipment",
	issuedOn: "2026-08-30",
	receiptNumber: "NS-260830-042",
	totalCents: 129_900,
};

export const defaultReceiptPresentation: ReceiptPresentation = {
	rotationDegrees: -2,
};

const PAPER_WIDTH = 860;
const PAPER_HEIGHT = 470;
const PAPER_X = -PAPER_WIDTH / 2;
const PAPER_Y = -PAPER_HEIGHT / 2;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
let receiptFontsPromise: Promise<void> | undefined;

export function renderReceipt(
	canvas: HTMLCanvasElement,
	rawContent: ReceiptContent,
	presentation: ReceiptPresentation,
) {
	const content = normalizeReceipt(rawContent);
	const rotation = clamp(presentation.rotationDegrees, -6, 6);

	canvas.width = RECEIPT_CANVAS_WIDTH;
	canvas.height = RECEIPT_CANVAS_HEIGHT;

	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("This browser could not create the receipt canvas.");
	}

	drawCanvasSurface(context);

	context.save();
	context.translate(RECEIPT_CANVAS_WIDTH / 2, RECEIPT_CANVAS_HEIGHT / 2);
	context.rotate(degreesToRadians(rotation));
	drawPaperReceipt(context, content);
	context.restore();
}

export function loadReceiptFonts() {
	if (!document.fonts) {
		return Promise.resolve();
	}

	receiptFontsPromise ??= Promise.allSettled([
		document.fonts.load('700 56px "Chakra Petch"'),
		document.fonts.load('600 28px "Plus Jakarta Sans"'),
		document.fonts.load('500 22px "Plus Jakarta Sans"'),
		document.fonts.load('600 18px "Monaspace Krypton"'),
	]).then(() => undefined);

	return receiptFontsPromise;
}

function drawCanvasSurface(context: CanvasRenderingContext2D) {
	const background = context.createLinearGradient(
		0,
		0,
		RECEIPT_CANVAS_WIDTH,
		RECEIPT_CANVAS_HEIGHT,
	);
	background.addColorStop(0, "#141722");
	background.addColorStop(1, "#242838");
	context.fillStyle = background;
	context.fillRect(0, 0, RECEIPT_CANVAS_WIDTH, RECEIPT_CANVAS_HEIGHT);

	const glow = context.createRadialGradient(930, 90, 0, 930, 90, 620);
	glow.addColorStop(0, "rgba(241, 211, 2, 0.16)");
	glow.addColorStop(1, "rgba(241, 211, 2, 0)");
	context.fillStyle = glow;
	context.fillRect(0, 0, RECEIPT_CANVAS_WIDTH, RECEIPT_CANVAS_HEIGHT);

	context.save();
	context.strokeStyle = "rgba(255, 255, 255, 0.045)";
	context.lineWidth = 1;

	for (let x = 0.5; x < RECEIPT_CANVAS_WIDTH; x += 30) {
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, RECEIPT_CANVAS_HEIGHT);
		context.stroke();
	}

	for (let y = 0.5; y < RECEIPT_CANVAS_HEIGHT; y += 30) {
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(RECEIPT_CANVAS_WIDTH, y);
		context.stroke();
	}

	context.restore();
}

function drawPaperReceipt(
	context: CanvasRenderingContext2D,
	content: ReceiptContent,
) {
	context.save();
	context.shadowColor = "rgba(0, 0, 0, 0.38)";
	context.shadowBlur = 34;
	context.shadowOffsetY = 22;
	context.fillStyle = "#f7f3e8";
	context.beginPath();
	context.roundRect(PAPER_X, PAPER_Y, PAPER_WIDTH, PAPER_HEIGHT, 14);
	context.fill();
	context.restore();

	context.save();
	context.beginPath();
	context.roundRect(PAPER_X, PAPER_Y, PAPER_WIDTH, PAPER_HEIGHT, 14);
	context.clip();

	const paper = context.createLinearGradient(
		PAPER_X,
		PAPER_Y,
		-PAPER_X,
		-PAPER_Y,
	);
	paper.addColorStop(0, "#fffdf6");
	paper.addColorStop(1, "#eee8d8");
	context.fillStyle = paper;
	context.fillRect(PAPER_X, PAPER_Y, PAPER_WIDTH, PAPER_HEIGHT);

	context.fillStyle = "#f1d302";
	context.fillRect(PAPER_X, PAPER_Y, 18, PAPER_HEIGHT);

	drawPaperPattern(context);
	drawReceiptContent(context, content);
	context.restore();
}

function drawPaperPattern(context: CanvasRenderingContext2D) {
	context.save();
	context.fillStyle = "rgba(24, 27, 38, 0.055)";

	for (let x = 236; x <= 390; x += 22) {
		for (let y = -205; y <= -52; y += 22) {
			context.beginPath();
			context.arc(x, y, 2.2, 0, Math.PI * 2);
			context.fill();
		}
	}

	context.restore();
}

function drawReceiptContent(
	context: CanvasRenderingContext2D,
	content: ReceiptContent,
) {
	const left = PAPER_X + 72;
	const right = -PAPER_X - 58;

	drawFittedText(context, {
		color: "#181b26",
		family: '"Chakra Petch", system-ui, sans-serif',
		fontSize: 38,
		fontWeight: 700,
		maxWidth: 450,
		minFontSize: 25,
		text: content.businessName,
		x: left,
		y: -164,
	});

	drawText(context, {
		color: "#666878",
		font: '600 17px "Monaspace Krypton", monospace',
		text: "SALE RECEIPT",
		x: left,
		y: -122,
	});

	drawText(context, {
		align: "right",
		color: "#666878",
		font: '600 16px "Monaspace Krypton", monospace',
		text: `TOTAL · ${content.currency}`,
		x: right,
		y: -122,
	});

	drawFittedText(context, {
		align: "right",
		color: "#181b26",
		family: '"Chakra Petch", system-ui, sans-serif',
		fontSize: 70,
		fontWeight: 700,
		maxWidth: 420,
		minFontSize: 44,
		text: formatMoney(content.totalCents, content.currency),
		x: right,
		y: -46,
	});

	context.save();
	context.setLineDash([10, 10]);
	context.strokeStyle = "rgba(24, 27, 38, 0.24)";
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(left, 1);
	context.lineTo(right, 1);
	context.stroke();
	context.restore();

	drawDetail(context, "CUSTOMER", content.customerName, left, 60, 360);
	drawDetail(context, "DESCRIPTION", content.description, left, 142, 470);
	drawDetail(context, "DATE", formatDate(content.issuedOn), 160, 60, 215);
	drawDetail(
		context,
		"RECEIPT NO.",
		content.receiptNumber,
		160,
		142,
		215,
		true,
	);

	drawText(context, {
		color: "#666878",
		font: '500 16px "Plus Jakarta Sans", system-ui, sans-serif',
		text: "Thank you. Keep this receipt for your records.",
		x: left,
		y: 205,
	});

	drawBarcode(context, right - 176, 176, content.receiptNumber);
}

function drawDetail(
	context: CanvasRenderingContext2D,
	label: string,
	value: string,
	x: number,
	y: number,
	maxWidth: number,
	monospace = false,
) {
	drawText(context, {
		color: "#777988",
		font: '600 14px "Monaspace Krypton", monospace',
		text: label,
		x,
		y,
	});

	drawFittedText(context, {
		color: "#181b26",
		family: monospace
			? '"Monaspace Krypton", monospace'
			: '"Plus Jakarta Sans", system-ui, sans-serif',
		fontSize: 24,
		fontWeight: 600,
		maxWidth,
		minFontSize: 17,
		text: value,
		x,
		y: y + 32,
	});
}

function drawBarcode(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	seed: string,
) {
	context.save();
	context.fillStyle = "rgba(24, 27, 38, 0.76)";
	let cursor = x;

	for (let index = 0; index < 28; index += 1) {
		const code = seed.charCodeAt(index % seed.length) || 1;
		const width = code % 3 === 0 ? 4 : 2;
		context.fillRect(cursor, y, width, 30);
		cursor += width + (code % 2 === 0 ? 3 : 5);
	}

	context.restore();
}

function drawText(
	context: CanvasRenderingContext2D,
	input: {
		align?: CanvasTextAlign;
		color: string;
		font: string;
		text: string;
		x: number;
		y: number;
	},
) {
	context.fillStyle = input.color;
	context.font = input.font;
	context.textAlign = input.align ?? "left";
	context.textBaseline = "alphabetic";
	context.fillText(input.text, input.x, input.y);
}

function drawFittedText(
	context: CanvasRenderingContext2D,
	input: {
		align?: CanvasTextAlign;
		color: string;
		family: string;
		fontSize: number;
		fontWeight: number;
		maxWidth: number;
		minFontSize: number;
		text: string;
		x: number;
		y: number;
	},
) {
	let fontSize = input.fontSize;

	while (fontSize > input.minFontSize) {
		context.font = `${input.fontWeight} ${fontSize}px ${input.family}`;

		if (context.measureText(input.text).width <= input.maxWidth) {
			break;
		}

		fontSize -= 1;
	}

	context.fillStyle = input.color;
	context.font = `${input.fontWeight} ${fontSize}px ${input.family}`;
	context.textAlign = input.align ?? "left";
	context.textBaseline = "alphabetic";
	context.fillText(input.text, input.x, input.y, input.maxWidth);
}

function normalizeReceipt(content: ReceiptContent): ReceiptContent {
	return {
		...content,
		businessName: cleanText(content.businessName, 48, "Northstar Supply"),
		customerName: cleanText(content.customerName, 64, "Walk-in customer"),
		description: cleanText(content.description, 72, "General sale"),
		issuedOn: isValidDateOnly(content.issuedOn)
			? content.issuedOn
			: "2026-08-30",
		receiptNumber: cleanText(content.receiptNumber, 32, "UNASSIGNED"),
		totalCents:
			Number.isSafeInteger(content.totalCents) && content.totalCents >= 0
				? content.totalCents
				: 0,
	};
}

function cleanText(value: string, maxLength: number, fallback: string) {
	return value.trim().slice(0, maxLength) || fallback;
}

function isValidDateOnly(value: string) {
	const match = DATE_ONLY_PATTERN.exec(value);

	if (!match) {
		return false;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));

	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

function formatMoney(totalCents: number, currency: ReceiptContent["currency"]) {
	return new Intl.NumberFormat("en-US", {
		currency,
		currencyDisplay: "symbol",
		style: "currency",
	}).format(totalCents / 100);
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeZone: "UTC",
	}).format(new Date(`${date}T12:00:00Z`));
}

function degreesToRadians(degrees: number) {
	return (degrees * Math.PI) / 180;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

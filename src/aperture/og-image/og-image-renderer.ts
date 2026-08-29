export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_FILE_NAME = "ozmah-dev-og.png";

export interface OgImageContent {
	name: string;
	siteTitle: string;
	tagline: string;
}

export const defaultOgImageContent: OgImageContent = {
	name: "Gabriel",
	siteTitle: "ozmah.dev",
	tagline: "Mostly a web developer.",
};

interface OgPalette {
	accent: string;
	background: string;
	border: string;
	foreground: string;
	muted: string;
}

export async function renderOgImage(
	canvas: HTMLCanvasElement,
	content: OgImageContent,
) {
	await loadOgFonts();

	canvas.width = OG_IMAGE_WIDTH;
	canvas.height = OG_IMAGE_HEIGHT;

	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("This browser could not create the OG image.");
	}

	const palette = getOgPalette();

	context.clearRect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);
	context.fillStyle = palette.background;
	context.fillRect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);

	drawBackgroundGlow(context, palette);
	drawMaskedGrid(context, palette);

	context.fillStyle = palette.accent;
	context.fillRect(96, 94, 80, 4);

	drawFittedText(context, {
		color: palette.foreground,
		family: '"Chakra Petch", system-ui, sans-serif',
		fontSize: 132,
		fontWeight: 700,
		maxWidth: 1008,
		minFontSize: 72,
		text: content.siteTitle || "ozmah.dev",
		x: 96,
		y: 312,
	});

	drawGreeting(context, content.name || "Gabriel", palette);

	drawFittedText(context, {
		color: palette.muted,
		family: '"Monaspace Krypton", "SFMono-Regular", Consolas, monospace',
		fontSize: 48,
		fontWeight: 500,
		maxWidth: 1008,
		minFontSize: 30,
		text: content.tagline || "Mostly a web developer.",
		x: 96,
		y: 542,
	});
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("The browser could not encode the OG image."));
				return;
			}

			resolve(blob);
		}, "image/png");
	});
}

function drawGreeting(
	context: CanvasRenderingContext2D,
	name: string,
	palette: OgPalette,
) {
	const prefix = "Hi, I'm ";
	const suffix = ".";
	const maxWidth = 1008;
	let fontSize = 48;

	while (fontSize > 30) {
		context.font = monoFont(fontSize, 500);

		if (context.measureText(`${prefix}${name}${suffix}`).width <= maxWidth) {
			break;
		}

		fontSize -= 2;
	}

	context.textAlign = "left";
	context.textBaseline = "alphabetic";
	context.font = monoFont(fontSize, 500);
	context.fillStyle = palette.muted;
	context.fillText(prefix, 96, 458);

	const nameX = 96 + context.measureText(prefix).width;
	context.fillStyle = palette.accent;
	context.font = monoFont(fontSize, 700);
	context.fillText(name, nameX, 458);

	const suffixX = nameX + context.measureText(name).width;
	context.fillStyle = palette.muted;
	context.font = monoFont(fontSize, 500);
	context.fillText(suffix, suffixX, 458);
}

function drawFittedText(
	context: CanvasRenderingContext2D,
	input: {
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

		fontSize -= 2;
	}

	context.fillStyle = input.color;
	context.font = `${input.fontWeight} ${fontSize}px ${input.family}`;
	context.textAlign = "left";
	context.textBaseline = "alphabetic";
	context.fillText(input.text, input.x, input.y, input.maxWidth);
}

function drawBackgroundGlow(
	context: CanvasRenderingContext2D,
	palette: OgPalette,
) {
	const glow = context.createRadialGradient(950, 90, 0, 950, 90, 650);
	glow.addColorStop(0, palette.border);
	glow.addColorStop(1, "transparent");

	context.save();
	context.globalAlpha = 0.13;
	context.fillStyle = glow;
	context.fillRect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);
	context.restore();
}

function drawMaskedGrid(context: CanvasRenderingContext2D, palette: OgPalette) {
	const gridCanvas = document.createElement("canvas");
	gridCanvas.width = OG_IMAGE_WIDTH;
	gridCanvas.height = OG_IMAGE_HEIGHT;

	const grid = gridCanvas.getContext("2d");

	if (!grid) {
		return;
	}

	grid.save();
	grid.globalAlpha = 0.22;
	grid.strokeStyle = palette.border;
	grid.lineWidth = 1;

	for (let x = 680.5; x <= OG_IMAGE_WIDTH; x += 16) {
		grid.beginPath();
		grid.moveTo(x, 0);
		grid.lineTo(x, 430);
		grid.stroke();
	}

	for (let y = 0.5; y <= 430; y += 16) {
		grid.beginPath();
		grid.moveTo(680, y);
		grid.lineTo(OG_IMAGE_WIDTH, y);
		grid.stroke();
	}

	grid.restore();
	grid.globalCompositeOperation = "destination-in";

	const mask = grid.createRadialGradient(1010, 100, 0, 1010, 100, 520);
	mask.addColorStop(0, "rgba(0, 0, 0, 1)");
	mask.addColorStop(0.62, "rgba(0, 0, 0, 0.72)");
	mask.addColorStop(1, "rgba(0, 0, 0, 0)");
	grid.fillStyle = mask;
	grid.fillRect(620, 0, 580, 500);

	context.drawImage(gridCanvas, 0, 0);
}

function getOgPalette(): OgPalette {
	return {
		accent: cssColor("--accent", "#f1d302"),
		background: cssColor("--background", "#181b26"),
		border: cssColor("--border", "#42424d"),
		foreground: cssColor("--foreground", "#f9f9f9"),
		muted: cssColor("--muted", "#e8e9ed"),
	};
}

function cssColor(variableName: string, fallback: string) {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(variableName)
		.trim();

	if (!value) {
		return fallback;
	}

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) {
		return fallback;
	}

	const initialColor = context.fillStyle;
	context.fillStyle = value;

	return context.fillStyle === initialColor && value !== initialColor
		? fallback
		: value;
}

function monoFont(fontSize: number, fontWeight: number) {
	return `${fontWeight} ${fontSize}px "Monaspace Krypton", "SFMono-Regular", Consolas, monospace`;
}

async function loadOgFonts() {
	if (!document.fonts) {
		return;
	}

	await Promise.allSettled([
		document.fonts.load('700 132px "Chakra Petch"'),
		document.fonts.load('500 48px "Monaspace Krypton"'),
		document.fonts.load('700 48px "Monaspace Krypton"'),
	]);
}

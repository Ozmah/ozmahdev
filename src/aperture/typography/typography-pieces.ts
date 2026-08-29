export type TypographyPieceId =
	| "action"
	| "body"
	| "display"
	| "heading"
	| "label"
	| "mono";

export interface TypographyPieceDefinition {
	defaultPosition: { x: number; y: number };
	defaultText: string;
	defaultWidth: number;
	editorClassName: string;
	fontName: string;
	id: TypographyPieceId;
	label: string;
	minWidth: number;
	previewClassName: string;
	purpose: string;
	rows: number;
}

export interface PlacedTypographyPiece {
	id: TypographyPieceId;
	order: number;
	text: string;
	width: number;
	x: number;
	y: number;
	zIndex: number;
}

export const TYPOGRAPHY_PIECES: readonly TypographyPieceDefinition[] = [
	{
		defaultPosition: { x: 24, y: 24 },
		defaultText: "Section label",
		defaultWidth: 184,
		editorClassName:
			"font-oz-mono text-xs text-accent uppercase leading-5 tracking-[0.16em]",
		fontName: "Monaspace Krypton",
		id: "label",
		label: "Label",
		minWidth: 136,
		previewClassName:
			"font-oz-mono text-xs text-accent uppercase tracking-[0.14em]",
		purpose: "Small labels for sections, categories, and metadata.",
		rows: 1,
	},
	{
		defaultPosition: { x: 24, y: 72 },
		defaultText: "Display type introduces the page.",
		defaultWidth: 456,
		editorClassName:
			"font-oz-display text-5xl text-foreground leading-[0.95] tracking-[-0.04em]",
		fontName: "Chakra Petch",
		id: "display",
		label: "Display",
		minWidth: 240,
		previewClassName:
			"font-oz-display text-2xl text-foreground leading-none tracking-[-0.04em]",
		purpose: "Primary page titles and opening statements.",
		rows: 2,
	},
	{
		defaultPosition: { x: 56, y: 312 },
		defaultText: "Not a crappy title",
		defaultWidth: 360,
		editorClassName:
			"font-oz-display text-3xl text-foreground leading-tight tracking-[-0.04em]",
		fontName: "Chakra Petch",
		id: "heading",
		label: "Heading",
		minWidth: 208,
		previewClassName:
			"font-oz-display text-xl text-foreground leading-tight tracking-[-0.04em]",
		purpose: "Section titles that establish hierarchy within a page.",
		rows: 1,
	},
	{
		defaultPosition: { x: 24, y: 224 },
		defaultText:
			"The right man in the wrong place can make all the difference in the world.",
		defaultWidth: 408,
		editorClassName:
			"font-oz-sans text-base text-muted leading-7 tracking-[-0.025em]",
		fontName: "Plus Jakarta Sans",
		id: "body",
		label: "Body",
		minWidth: 208,
		previewClassName:
			"font-oz-sans text-sm text-muted leading-6 tracking-[-0.02em]",
		purpose: "Paragraphs, descriptions, and interface explanations.",
		rows: 3,
	},
	{
		defaultPosition: { x: 56, y: 408 },
		defaultText: "Open project",
		defaultWidth: 200,
		editorClassName:
			"font-oz-action text-xl font-bold text-accent uppercase leading-none tracking-[0.06em]",
		fontName: "Barlow Condensed",
		id: "action",
		label: "Action",
		minWidth: 144,
		previewClassName:
			"font-oz-action text-lg font-bold text-accent uppercase tracking-[0.06em]",
		purpose: "Buttons and short labels that describe an action.",
		rows: 1,
	},
	{
		defaultPosition: { x: 272, y: 392 },
		defaultText: "font: Monaspace Krypton\nrole: code and metadata",
		defaultWidth: 216,
		editorClassName: "font-oz-mono text-sm text-muted leading-6 tabular-nums",
		fontName: "Monaspace Krypton",
		id: "mono",
		label: "Mono",
		minWidth: 176,
		previewClassName: "font-oz-mono text-xs text-muted leading-5 tabular-nums",
		purpose: "Code, commands, metadata, and tabular values.",
		rows: 2,
	},
];

export const INITIAL_TYPOGRAPHY_COMPOSITION: readonly PlacedTypographyPiece[] =
	TYPOGRAPHY_PIECES.filter(({ id }) =>
		["label", "display", "body", "action"].includes(id),
	).map((piece, index) => ({
		id: piece.id,
		order: index,
		text: piece.defaultText,
		width: piece.defaultWidth,
		x: piece.defaultPosition.x,
		y: piece.defaultPosition.y,
		zIndex: index + 1,
	}));

export function getTypographyPiece(id: TypographyPieceId) {
	const piece = TYPOGRAPHY_PIECES.find((candidate) => candidate.id === id);

	if (!piece) {
		throw new Error(`Unknown typography piece: ${id}`);
	}

	return piece;
}

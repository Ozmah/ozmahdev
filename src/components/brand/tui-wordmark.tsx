/**
 * TUI-style wordmark renderer.
 *
 * This intentionally does not use a pixel font. Each supported character is a
 * hand-authored bitmap glyph and the component renders those cells as SVG
 * rectangles. That gives the site a custom wordmark language while keeping the
 * output scalable, crisp, and accessible.
 */
import { GLYPHS, type Glyph, ROWS } from "./glyphs";

type WordmarkTone = "citrus" | "lime" | "mixed" | "muted" | "pink" | "white";

interface TuiWordmarkProps {
	ariaLabel?: string;
	cellGap?: number;
	cellSize?: number;
	className?: string;
	letterGap?: number;
	text: string;
	tone?: WordmarkTone;
}

// The fallback intentionally looks like a question mark so missing glyphs are
// obvious in `/aperture` instead of silently shipping as broken branding.
const FALLBACK_GLYPH: Glyph = {
	width: 4,
	rows: [
		"1111",
		"1001",
		"0001",
		"0010",
		"0100",
		"0000",
		"0100",
		"0000",
		"0000",
	],
};

const SPACE_GLYPH: Glyph = {
	width: 3,
	rows: Array.from({ length: ROWS }, () => "000"),
};

/**
 * Renders a custom TUI bitmap wordmark as crisp SVG cells.
 *
 * Unknown characters use a visible fallback glyph so missing coverage is caught
 * in `/aperture` instead of silently disappearing.
 *
 * @param cellSize Size of each drawn square cell in SVG units.
 * @param cellGap Gap between cells inside the same glyph.
 * @param letterGap Gap between glyphs, separate from the cell grid.
 */
export function TuiWordmark({
	ariaLabel,
	cellGap = 2,
	cellSize = 12,
	className,
	letterGap = 6,
	text,
	tone = "white",
}: TuiWordmarkProps) {
	const glyphRuns = Array.from(text).map((character) => ({
		character,
		glyph: getGlyph(character),
	}));

	const cellStep = cellSize + cellGap;
	const height = ROWS * cellStep - cellGap;

	const width = glyphRuns.reduce((total, { glyph }, index) => {
		const glyphWidth = glyph.width * cellStep - cellGap;
		const spacing = index === glyphRuns.length - 1 ? 0 : letterGap;

		return total + glyphWidth + spacing;
	}, 0);

	let xOffset = 0;

	const cells = glyphRuns.flatMap(({ glyph }, glyphIndex) => {
		const glyphCells = glyph.rows.flatMap((row, y) =>
			Array.from(row).flatMap((cell, x) => {
				if (cell !== "1") {
					return [];
				}

				return [
					{
						fill: getCellFill({ tone }),
						key: `${glyphIndex}-${x}-${y}`,
						x: xOffset + x * cellStep,
						y: y * cellStep,
					},
				];
			}),
		);

		xOffset += glyph.width * cellStep - cellGap + letterGap;

		return glyphCells;
	});

	return (
		<svg
			aria-label={ariaLabel ?? text}
			className={className}
			role="img"
			shapeRendering="crispEdges"
			viewBox={`0 0 ${width} ${height}`}
		>
			{cells.map((cell) => (
				<rect
					fill={cell.fill}
					height={cellSize}
					key={cell.key}
					width={cellSize}
					x={cell.x}
					y={cell.y}
				/>
			))}
		</svg>
	);
}

/** Resolves supported characters; unknown glyphs intentionally render as fallback so missing coverage is visible. */
function getGlyph(character: string): Glyph {
	if (character === " ") {
		return SPACE_GLYPH;
	}

	return GLYPHS[character] ?? FALLBACK_GLYPH;
}

/** Maps wordmark tones to design tokens */
function getCellFill({ tone }: { tone: WordmarkTone }) {
	if (tone === "citrus") {
		return "var(--color-oz-lime)";
	}

	if (tone === "pink") {
		return "var(--color-oz-pink)";
	}

	if (tone === "white") {
		return "var(--color-oz-white)";
	}

	if (tone === "muted") {
		return "var(--color-oz-muted)";
	}

	return "var(--color-oz-white)";
}

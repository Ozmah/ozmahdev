type WordmarkTone = "lime" | "mixed" | "muted" | "white";

interface TuiWordmarkProps {
	ariaLabel?: string;
	cellGap?: number;
	cellSize?: number;
	className?: string;
	letterGap?: number;
	text: string;
	tone?: WordmarkTone;
}

interface Glyph {
	rows: string[];
	width: number;
}

const ROWS = 9;
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

const GLYPHS: Record<string, Glyph> = {
	A: glyph([
		"01110",
		"10001",
		"10001",
		"11111",
		"10001",
		"10001",
		"10001",
		"00000",
		"00000",
	]),
	C: glyph([
		"01111",
		"10000",
		"10000",
		"10000",
		"10000",
		"10000",
		"01111",
		"00000",
		"00000",
	]),
	D: glyph([
		"11110",
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"11110",
		"00000",
		"00000",
	]),
	E: glyph([
		"11111",
		"10000",
		"10000",
		"11110",
		"10000",
		"10000",
		"11111",
		"00000",
		"00000",
	]),
	H: glyph([
		"10001",
		"10001",
		"10001",
		"11111",
		"10001",
		"10001",
		"10001",
		"00000",
		"00000",
	]),
	M: glyph([
		"10001",
		"11011",
		"10101",
		"10101",
		"10001",
		"10001",
		"10001",
		"00000",
		"00000",
	]),
	O: glyph([
		"01110",
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"01110",
		"00000",
		"00000",
	]),
	V: glyph([
		"10001",
		"10001",
		"10001",
		"10001",
		"01010",
		"01010",
		"00100",
		"00000",
		"00000",
	]),
	Z: glyph([
		"11111",
		"00001",
		"00010",
		"00100",
		"01000",
		"10000",
		"11111",
		"00000",
		"00000",
	]),
	a: glyph([
		"0000",
		"0000",
		"0110",
		"0001",
		"0111",
		"1001",
		"0111",
		"0000",
		"0000",
	]),
	c: glyph([
		"0000",
		"0000",
		"0111",
		"1000",
		"1000",
		"1000",
		"0111",
		"0000",
		"0000",
	]),
	d: glyph([
		"0001",
		"0001",
		"0111",
		"1001",
		"1001",
		"1001",
		"0111",
		"0000",
		"0000",
	]),
	e: glyph([
		"0000",
		"0000",
		"0110",
		"1001",
		"1111",
		"1000",
		"0111",
		"0000",
		"0000",
	]),
	h: glyph([
		"1000",
		"1000",
		"1110",
		"1001",
		"1001",
		"1001",
		"1001",
		"0000",
		"0000",
	]),
	m: glyph([
		"00000",
		"00000",
		"11010",
		"10101",
		"10101",
		"10101",
		"10101",
		"00000",
		"00000",
	]),
	n: glyph([
		"0000",
		"0000",
		"1110",
		"1001",
		"1001",
		"1001",
		"1001",
		"0000",
		"0000",
	]),
	o: glyph([
		"0000",
		"0000",
		"0110",
		"1001",
		"1001",
		"1001",
		"0110",
		"0000",
		"0000",
	]),
	p: glyph([
		"0000",
		"0000",
		"1110",
		"1001",
		"1001",
		"1110",
		"1000",
		"1000",
		"0000",
	]),
	v: glyph([
		"0000",
		"0000",
		"1001",
		"1001",
		"1001",
		"0110",
		"0110",
		"0000",
		"0000",
	]),
	z: glyph([
		"0000",
		"0000",
		"1111",
		"0001",
		"0010",
		"0100",
		"1111",
		"0000",
		"0000",
	]),
};

export function TuiWordmark({
	ariaLabel,
	cellGap = 2,
	cellSize = 12,
	className,
	letterGap = 6,
	text,
	tone = "mixed",
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
	const cells = glyphRuns.flatMap(({ character, glyph }, glyphIndex) => {
		const glyphCells = glyph.rows.flatMap((row, y) =>
			Array.from(row).flatMap((cell, x) => {
				if (cell !== "1") {
					return [];
				}

				return [
					{
						fill: getCellFill({ character, glyphIndex, tone, x }),
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

function glyph(rows: string[]): Glyph {
	return {
		rows,
		width: rows[0]?.length ?? 0,
	};
}

function getGlyph(character: string): Glyph {
	if (character === " ") {
		return SPACE_GLYPH;
	}

	return GLYPHS[character] ?? FALLBACK_GLYPH;
}

function getCellFill({
	character,
	glyphIndex,
	tone,
	x,
}: {
	character: string;
	glyphIndex: number;
	tone: WordmarkTone;
	x: number;
}) {
	if (tone === "lime") {
		return "var(--color-oz-lime)";
	}

	if (tone === "white") {
		return "var(--color-oz-white)";
	}

	if (tone === "muted") {
		return "var(--color-oz-muted)";
	}

	if (
		character === character.toLowerCase() &&
		character !== character.toUpperCase()
	) {
		return "var(--color-oz-white)";
	}

	return (glyphIndex + x) % 3 === 0
		? "var(--color-oz-dim)"
		: "var(--color-oz-white)";
}

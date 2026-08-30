import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../cn";

export interface GridBackgroundSettings {
	cellHeight: number;
	cellWidth: number;
	lineOpacity: number;
	lineWidth: number;
	maskEnabled: boolean;
	maskHeight: number;
	maskStop: number;
	maskWidth: number;
	maskX: number;
	maskY: number;
}

interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
	settings?: Partial<GridBackgroundSettings>;
}

export function GridBackground({
	className,
	settings,
	style,
	...props
}: GridBackgroundProps) {
	const gridSettings = { ...defaultGridBackgroundSettings, ...settings };
	const maskImage = gridSettings.maskEnabled
		? `radial-gradient(ellipse ${gridSettings.maskWidth}% ${gridSettings.maskHeight}% at ${gridSettings.maskX}% ${gridSettings.maskY}%, #000 ${gridSettings.maskStop}%, transparent 100%)`
		: undefined;

	return (
		<div
			aria-hidden="true"
			className={cn("pointer-events-none absolute inset-0", className)}
			style={
				{
					...style,
					"--grid-line-color": `color-mix(in oklch, currentColor ${gridSettings.lineOpacity}%, transparent)`,
					backgroundImage:
						"linear-gradient(to right, var(--grid-line-color) var(--grid-line-width), transparent var(--grid-line-width)), linear-gradient(to bottom, var(--grid-line-color) var(--grid-line-width), transparent var(--grid-line-width))",
					backgroundSize: `${gridSettings.cellWidth}px ${gridSettings.cellHeight}px`,
					maskImage,
					WebkitMaskImage: maskImage,
					"--grid-line-width": `${gridSettings.lineWidth}px`,
				} as GridBackgroundStyle
			}
			{...props}
		/>
	);
}

type GridBackgroundStyle = CSSProperties & {
	"--grid-line-color"?: string;
	"--grid-line-width"?: string;
};

export const defaultGridBackgroundSettings = {
	cellHeight: 24,
	cellWidth: 14,
	lineOpacity: 18,
	lineWidth: 1,
	maskEnabled: true,
	maskHeight: 50,
	maskStop: 70,
	maskWidth: 60,
	maskX: 50,
	maskY: 0,
} satisfies GridBackgroundSettings;

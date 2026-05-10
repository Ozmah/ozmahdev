import { ColorSwatch } from "../components/color-swatch";

export function PaletteSection() {
	return (
		<section className="border-oz-line border-b py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Palette: Mindful Palettes #50 by Alex Cristache (@AlexCristache) / MP050
			</h2>
			<div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
				<ColorSwatch
					className="bg-oz-white text-oz-black"
					hex="oklch(98.212% 0 89.88)"
					name="Doctor"
				/>
				<ColorSwatch
					className="bg-oz-black text-oz-white"
					hex="oklch(22.428% 0.02197 272.68)"
					name="Coarse Wool"
				/>
				<ColorSwatch
					className="bg-oz-surface-raised text-oz-white"
					hex="oklch(38.333% 0.01855 285.49)"
					name="Flint Purple"
				/>
				<ColorSwatch
					className="bg-oz-lime text-oz-black"
					hex="oklch(86.561% 0.17906 98.79)"
					name="Citrus Burst"
				/>
				<ColorSwatch
					className="bg-oz-pink text-oz-white"
					hex="oklch(65.592% 0.21177 354.31)"
					name="Pink Fluoride"
				/>
				<ColorSwatch
					className="bg-oz-muted text-oz-black"
					hex="oklch(93.44% 0.00548 274.96)"
					name="Winter Dove"
				/>
			</div>
			<div className="mt-4 h-28 border border-oz-line bg-[linear-gradient(135deg,#ec4899_0%,#f1d302_100%)]" />
		</section>
	);
}

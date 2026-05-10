import { AperturePanel } from "../components/aperture-panel";
import { TypographySpecimen } from "../components/typography-specimen";

export function TypographySection() {
	return (
		<section className="border-oz-line border-b py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Typography Lab
			</h2>

			<div className="grid gap-6 lg:grid-cols-2">
				<TypographySpecimen
					className="font-oz-sans"
					label="Body / UI — Plus Jakarta Sans"
				/>
				<TypographySpecimen
					className="font-oz-display"
					label="Display — Chakra Petch"
				/>
				<TypographySpecimen
					className="font-oz-action"
					label="Action — Barlow Condensed 700"
				/>
				<TypographySpecimen
					className="font-oz-mono"
					label="Mono — Monaspace Krypton"
				/>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<AperturePanel title="Real Copy Combination">
					<div className="max-w-2xl">
						<p className="font-oz-mono text-oz-lime text-xs uppercase tracking-widest">
							Current Identity
						</p>
						<h3 className="font-oz-display mt-3 text-4xl leading-none text-balance md:text-6xl">
							A personal site by a developer shipping software.
						</h3>
						<p className="font-oz-sans text-oz-muted mt-4 max-w-[65ch] text-base leading-7">
							OzmahDev is where I document the work: projects, experiments,
							tools, games, notes, and the systems I build for myself.
						</p>
					</div>
				</AperturePanel>

				<AperturePanel title="Mono Stress">
					<div className="font-oz-mono text-oz-muted grid gap-2 text-sm tabular-nums">
						<p className="text-oz-lime">$ bun run build</p>
						<p>build complete in 1.23s</p>
						<p>UTC-6 · 0123456789 · TESSERACT_BOOTING</p>
						<p>Windows daily driver · Homelab online · OSS</p>
					</div>
				</AperturePanel>
			</div>
		</section>
	);
}

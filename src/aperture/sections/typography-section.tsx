import { AperturePanel } from "../aperture-panel";
import { TypographySpecimen } from "../typography-specimen";

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
							A personal site to show what I'm working on.
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

			<div className="mt-6">
				<AperturePanel title="Fluid Typography / pow()">
					<div className="grid gap-6">
						<div>
							<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
								Viewport powered scale
							</p>
							<h3 className="text-fluid-display mt-3 mb-0 font-oz-display leading-[0.9] text-foreground uppercase tracking-tight text-balance">
							    Text Fluid Display
							</h3>
							<p className="text-fluid-body mt-5 mb-0 max-w-[68ch] text-muted leading-[1.65]">
								This specimen uses fallback clamp tokens first, then upgrades to
								CSS pow() where supported for a slightly slower start and
								stronger finish across the viewport.
							</p>
						</div>

						<div className="grid gap-3 border-border border-t pt-4 font-oz-mono text-muted text-sm">
							<p className="m-0">
								<span className="text-accent">body</span> · 14px → 18px
							</p>
							<p className="m-0">
								<span className="text-accent">heading</span> · 32px → 72px
							</p>
							<p className="m-0">
								<span className="text-accent">display</span> · 48px → 136px
							</p>
						</div>
					</div>
				</AperturePanel>
			</div>
		</section>
	);
}

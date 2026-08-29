import { TypographyPlayground } from "../typography/typography-playground";

export function TypographySection() {
	return (
		<section
			className="scroll-mt-8 border-oz-line border-b py-8"
			id="typography-lab"
		>
			<h2 className="mb-6 font-oz-mono text-oz-lime text-sm uppercase tracking-wider">
				Typography Lab
			</h2>
			<TypographyPlayground />
		</section>
	);
}

import { ApertureHeader } from "./sections/aperture-header";
import { ButtonsSection } from "./sections/buttons-section";
import { InputsSection } from "./sections/inputs-section";
import { PaletteSection } from "./sections/palette-section";
import { TerminalSection } from "./sections/terminal-section";
import { TypographySection } from "./sections/typography-section";
import { WordmarkSection } from "./sections/wordmark-section";

export function AperturePage() {
	return (
		<div className="min-h-screen bg-oz-black py-8 text-oz-white">
			<ApertureHeader />
			<PaletteSection />
			<WordmarkSection />
			<TypographySection />
			<ButtonsSection />
			<InputsSection />
			<TerminalSection />
		</div>
	);
}

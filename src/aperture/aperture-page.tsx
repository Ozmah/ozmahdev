import { ApertureHeader } from "./sections/aperture-header";
import { ButtonsSection } from "./sections/buttons-section";
import { DropdownsSection } from "./sections/dropdowns-section";
import { InputsSection } from "./sections/inputs-section";
import { PaletteSection } from "./sections/palette-section";
import { SignalFrameSection } from "./sections/signal-frame-section";
import { SwitchesSection } from "./sections/switches-section";
import { TerminalSection } from "./sections/terminal-section";
import { TypographySection } from "./sections/typography-section";
import { WordmarkSection } from "./sections/wordmark-section";

export function AperturePage() {
	return (
		<div className="min-h-screen bg-oz-black py-8 text-oz-white">
			<h1 className="sr-only">OzmahDev Aperture component lab</h1>
			<ApertureHeader />
			<PaletteSection />
			<WordmarkSection />
			<TypographySection />
			<ButtonsSection />
			<DropdownsSection />
			<SwitchesSection />
			<SignalFrameSection />
			<InputsSection />
			<TerminalSection />
		</div>
	);
}

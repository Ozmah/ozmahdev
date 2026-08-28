import { createFileRoute } from "@tanstack/react-router";
import { ApertureHeader } from "#/aperture/sections/aperture-header";
import { BackgroundLabSection } from "#/aperture/sections/background-lab-section";
import { ButtonsSection } from "#/aperture/sections/buttons-section";
import { DropdownsSection } from "#/aperture/sections/dropdowns-section";
import { InputsSection } from "#/aperture/sections/inputs-section";
import { PaletteSection } from "#/aperture/sections/palette-section";
import { SignalFrameSection } from "#/aperture/sections/signal-frame-section";
import { SwitchesSection } from "#/aperture/sections/switches-section";
import { TerminalSection } from "#/aperture/sections/terminal-section";
import { TypographySection } from "#/aperture/sections/typography-section";
import { WordmarkSection } from "#/aperture/sections/wordmark-section";
import { PageContainer } from "#/shell/page-container";

export const Route = createFileRoute("/aperture")({
	component: AperturePage,
	head: () => ({
		meta: [
			{ title: "The Lab | OzmahDev" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});

function AperturePage() {
	return (
		<PageContainer variant="wider">
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
			<BackgroundLabSection />
		</PageContainer>
	);
}

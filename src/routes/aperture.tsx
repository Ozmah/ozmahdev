import { createFileRoute } from "@tanstack/react-router";
import { ApertureHeader } from "#/aperture/sections/aperture-header";
import { ArtifactSurfaceSection } from "#/aperture/sections/artifact-surface-section";
import { BackgroundLabSection } from "#/aperture/sections/background-lab-section";
import { ButtonsSection } from "#/aperture/sections/buttons-section";
import { DropdownsSection } from "#/aperture/sections/dropdowns-section";
import { InputsSection } from "#/aperture/sections/inputs-section";
import { OgImageSection } from "#/aperture/sections/og-image-section";
import { PaletteSection } from "#/aperture/sections/palette-section";
import { SwitchesSection } from "#/aperture/sections/switches-section";
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
		<PageContainer variant="wide">
			<h1 className="sr-only">OzmahDev Aperture component lab</h1>
			<ApertureHeader />

			<PaletteSection />
			<WordmarkSection />
			<TypographySection />
			<ButtonsSection />
			<DropdownsSection />
			<SwitchesSection />
			<ArtifactSurfaceSection />
			<InputsSection />
			<BackgroundLabSection />
			<OgImageSection />
		</PageContainer>
	);
}

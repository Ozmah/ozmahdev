import { Button } from "../../components/react/ui/button";
import { AperturePanel } from "../aperture-panel";

export function ButtonsSection() {
	return (
		<section className="grid gap-8 py-8 lg:grid-cols-3">
			<AperturePanel title="Primary CTA">
				<Button>View Work</Button>
				<Button disabled>View Work</Button>
			</AperturePanel>

			<AperturePanel title="Secondary">
				<Button variant="secondary">See Projects</Button>
				<Button disabled variant="secondary">
					See Projects
				</Button>
			</AperturePanel>

			<AperturePanel title="Tertiary / Card Action">
				<Button variant="tertiary">Explore Homelab</Button>
				<Button disabled variant="tertiary">
					Explore Homelab
				</Button>
			</AperturePanel>
		</section>
	);
}

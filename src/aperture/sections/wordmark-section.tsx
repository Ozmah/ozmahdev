import { TuiWordmark } from "@/components/brand/tui-wordmark";
import { AperturePanel } from "../components/aperture-panel";

export function WordmarkSection() {
	return (
		<section className="grid gap-8 border-oz-line border-b py-8 lg:grid-cols-2">
			<AperturePanel title="TUI Wordmark / Mixed Case">
				<TuiWordmark className="h-auto w-full max-w-xl" text="OzmahDev" />
				<TuiWordmark className="h-auto w-full max-w-xl" text="OpenCode" />
			</AperturePanel>

			<AperturePanel title="TUI Wordmark / Case Stress">
				<TuiWordmark
					className="h-auto w-full max-w-xl"
					text="OZMAHDEV"
					tone="lime"
				/>
				<TuiWordmark
					className="h-auto w-full max-w-xl"
					text="ozmahdev"
					tone="white"
				/>
			</AperturePanel>
		</section>
	);
}

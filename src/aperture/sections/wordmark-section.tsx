import { TuiWordmark } from "@/components/brand/tui-wordmark";
import { AperturePanel } from "../components/aperture-panel";

export function WordmarkSection() {
	return (
		<section className="border-oz-line border-b py-8">
			<div className="grid gap-8 lg:grid-cols-2">
				<AperturePanel title="TUI Wordmark / Mixed Case">
					<TuiWordmark className="h-auto w-full max-w-xl" text="Estus" />
					<TuiWordmark
						className="h-auto w-full max-w-xl"
						text="PipBoy"
						tone="citrus"
					/>
				</AperturePanel>

				<AperturePanel title="TUI Wordmark / Case Stress">
					<TuiWordmark
						className="h-auto w-full max-w-xl"
						text="MAGI"
						tone="pink"
					/>
					<TuiWordmark
						className="h-auto w-full max-w-xl"
						text="omnitool"
						tone="white"
					/>
				</AperturePanel>
			</div>

			<div className="mt-8">
				<AperturePanel title="TUI Wordmark / Glyph Inventory">
					<TuiWordmark
						cellSize={8}
						className="h-auto w-full"
						letterGap={4}
						text="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
					/>
					<TuiWordmark
						cellSize={8}
						className="h-auto w-full"
						letterGap={4}
						text="abcdefghijklmnopqrstuvwxyz"
						tone="citrus"
					/>
					<TuiWordmark
						cellSize={8}
						className="h-auto w-full"
						letterGap={4}
						text="0123456789?!+-@&$%"
						tone="pink"
					/>
				</AperturePanel>
			</div>
		</section>
	);
}

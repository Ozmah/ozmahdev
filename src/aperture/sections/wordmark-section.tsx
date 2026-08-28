import { TuiWordmark } from "@/components/brand/tui-wordmark";
import { AperturePanel } from "../aperture-panel";

export function WordmarkSection() {
	return (
		<section className="border-oz-line border-b py-8">
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

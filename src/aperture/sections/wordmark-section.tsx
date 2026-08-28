import { TuiWordmark } from "@/components/brand/tui-wordmark";
import { AperturePanel } from "../aperture-panel";

const glyphGroups = [
	{
		label: "Uppercase glyphs",
		text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		tone: "white",
	},
	{
		label: "Lowercase glyphs",
		text: "abcdefghijklmnopqrstuvwxyz",
		tone: "citrus",
	},
	{
		label: "Numeric and symbol glyphs",
		text: "0123456789?!+-@&$%",
		tone: "pink",
	},
] as const;

export function WordmarkSection() {
	return (
		<section className="border-oz-line border-b py-8">
			<div className="mt-8">
				<AperturePanel title="TUI Wordmark / Glyph Inventory">
					{glyphGroups.map((group) => (
						<div
							aria-label={group.label}
							className="flex w-full flex-wrap gap-x-1 gap-y-3"
							key={group.label}
							role="img"
						>
							{Array.from(group.text).map((character) => (
								<TuiWordmark
									cellSize={8}
									decorative
									key={character}
									letterGap={4}
									text={character}
									tone={group.tone}
								/>
							))}
						</div>
					))}
				</AperturePanel>
			</div>
		</section>
	);
}

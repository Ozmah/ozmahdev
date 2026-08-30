import { useState } from "react";
import {
	defaultGridBackgroundSettings,
	GridBackground,
	type GridBackgroundSettings,
} from "../../components/react/backgrounds/grid-background";
import { Button } from "../../components/react/ui/button";
import { RangeField } from "../../components/react/ui/range-field";
import { Switch } from "../../components/react/ui/switch";
import { AperturePanel } from "../aperture-panel";

export function BackgroundLabSection() {
	const [settings, setSettings] = useState(defaultGridBackgroundSettings);

	function updateSetting<Key extends keyof GridBackgroundSettings>(
		key: Key,
		value: GridBackgroundSettings[Key],
	) {
		setSettings((currentSettings) => ({
			...currentSettings,
			[key]: value,
		}));
	}

	return (
		<section className="border-oz-line border-t py-8" id="background-lab">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Background Lab
			</h2>

			<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
				<div className="relative isolate min-h-128 overflow-hidden border border-border-strong bg-background text-border-strong">
					<GridBackground settings={settings} />
					<div className="relative z-10 grid min-h-128 content-start p-6 sm:p-8">
						<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
							Portable background candidate
						</p>
						<h3 className="mt-4 mb-0 max-w-2xl font-oz-display text-4xl text-foreground uppercase tracking-tighter sm:text-6xl">
							Showing a title to see it combine with the background.
						</h3>
						<p className="mt-5 max-w-xl text-muted leading-7">
							This is a preview of Julien Thibeaut's work at
							https://bg.ibelick.com/. Controls only change numeric CSS
							variables, not raw class strings.
						</p>
					</div>
				</div>

				<AperturePanel title="Grid controls">
					<div className="grid w-full gap-4 sm:grid-cols-2">
						<RangeField
							label="Cell width"
							max={48}
							min={6}
							onValueChange={(value) => updateSetting("cellWidth", value)}
							unit="px"
							value={settings.cellWidth}
						/>
						<RangeField
							label="Cell height"
							max={72}
							min={6}
							onValueChange={(value) => updateSetting("cellHeight", value)}
							unit="px"
							value={settings.cellHeight}
						/>
						<RangeField
							label="Line opacity"
							max={60}
							min={4}
							onValueChange={(value) => updateSetting("lineOpacity", value)}
							unit="%"
							value={settings.lineOpacity}
						/>
						<RangeField
							label="Line width"
							max={3}
							min={1}
							onValueChange={(value) => updateSetting("lineWidth", value)}
							unit="px"
							value={settings.lineWidth}
						/>
						<RangeField
							label="Mask width"
							max={120}
							min={10}
							onValueChange={(value) => updateSetting("maskWidth", value)}
							unit="%"
							value={settings.maskWidth}
						/>
						<RangeField
							label="Mask height"
							max={120}
							min={10}
							onValueChange={(value) => updateSetting("maskHeight", value)}
							unit="%"
							value={settings.maskHeight}
						/>
						<RangeField
							label="Mask X"
							max={100}
							min={0}
							onValueChange={(value) => updateSetting("maskX", value)}
							unit="%"
							value={settings.maskX}
						/>
						<RangeField
							label="Mask Y"
							max={100}
							min={0}
							onValueChange={(value) => updateSetting("maskY", value)}
							unit="%"
							value={settings.maskY}
						/>
						<RangeField
							label="Mask stop"
							max={100}
							min={0}
							onValueChange={(value) => updateSetting("maskStop", value)}
							unit="%"
							value={settings.maskStop}
						/>
						<Switch
							checked={settings.maskEnabled}
							checkedLabel="Masked"
							label="Radial mask"
							onCheckedChange={(checked) =>
								updateSetting("maskEnabled", checked)
							}
							uncheckedLabel="Flat"
						/>
					</div>

					<div className="grid w-full gap-3 border-border border-t pt-4">
						<Button
							className="min-h-11 min-w-40 px-4 py-3"
							onClick={() => setSettings(defaultGridBackgroundSettings)}
							variant="secondary"
						>
							Reset grid
						</Button>
						<pre className="m-0 max-h-48 overflow-auto border border-border bg-background p-4 font-oz-mono text-muted text-xs leading-5">
							{JSON.stringify(settings, null, 2)}
						</pre>
					</div>
				</AperturePanel>
			</div>
		</section>
	);
}

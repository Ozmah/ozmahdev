import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { AperturePanel } from "../components/aperture-panel";

export function SwitchesSection() {
	const [relayEnabled, setRelayEnabled] = useState(false);
	const [recordingEnabled, setRecordingEnabled] = useState(true);
	const [guardEnabled, setGuardEnabled] = useState(false);

	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Switch System
			</h2>
			<div className="grid gap-8 lg:grid-cols-3">
				<AperturePanel title="Relay Switch">
					<Switch
						checked={relayEnabled}
						checkedLabel="LIVE"
						description="Custom state copy, mechanical layout."
						label="Signal Relay"
						onCheckedChange={setRelayEnabled}
						uncheckedLabel="STANDBY"
					/>
				</AperturePanel>

				<AperturePanel title="Operational Copy">
					<Switch
						checked={recordingEnabled}
						checkedLabel="CAPTURING"
						description="State labels are per instance, not hardcoded to ON/OFF."
						label="Tesseract Recorder"
						onCheckedChange={setRecordingEnabled}
						uncheckedLabel="IDLE"
					/>
					<Switch
						checked={guardEnabled}
						checkedLabel="ARMED"
						label="Guard Mode"
						onCheckedChange={setGuardEnabled}
						uncheckedLabel="SAFE"
					/>
				</AperturePanel>

				<AperturePanel title="Disabled States">
					<Switch
						checked={false}
						disabled
						label="Disabled Offline"
						onCheckedChange={() => undefined}
						uncheckedLabel="LOCKED"
					/>
					<Switch
						checked
						checkedLabel="FORCED"
						disabled
						label="Disabled Online"
						onCheckedChange={() => undefined}
					/>
				</AperturePanel>
			</div>
		</section>
	);
}

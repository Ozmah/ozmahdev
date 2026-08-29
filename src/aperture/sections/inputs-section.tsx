import { TextArea, TextInput } from "@/components/ui/text-field";
import { AperturePanel } from "../aperture-panel";

export function InputsSection() {
	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Input System
			</h2>
			<div className="grid gap-8 lg:grid-cols-2">
				<AperturePanel title="Text Inputs">
					<TextInput
						description="Used for short, direct text. No hidden label nonsense."
						label="Project Name"
						placeholder="Tesseract"
					/>
					<TextInput defaultValue="ozmah.dev" label="Domain" />
					<TextInput
						error="This needs a real value before it ships."
						label="Broken Field"
						placeholder="Required"
					/>
					<TextInput
						disabled
						label="Disabled Field"
						placeholder="Not available yet"
					/>
				</AperturePanel>

				<AperturePanel title="Text Area">
					<TextArea
						description="For notes, project descriptions, and small chunks of personal copy."
						label="Project Notes"
						placeholder="Stay awhile and listen."
					/>
					<TextArea defaultValue="Would you kindly?" label="About Draft" />
				</AperturePanel>
			</div>
		</section>
	);
}

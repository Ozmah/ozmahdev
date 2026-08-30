import { useState } from "react";
import {
	Combobox,
	type DropdownOption,
	MultiSelect,
	Select,
} from "../../components/react/ui/dropdown";
import { AperturePanel } from "../aperture-panel";

const projectOptions: DropdownOption[] = [
	{
		description: "Public site, design system, and component lab.",
		kicker: "Personal",
		label: "OzmahDev",
		value: "ozmah-dev",
	},
	{
		description: "Twitch and YouTube overlay experiments.",
		kicker: "Streaming",
		label: "Rigged",
		value: "rigged",
	},
	{
		description: "Local camera orchestration and recording system.",
		kicker: "Homelab",
		label: "Tesseract",
		value: "tesseract",
	},
	{
		description: "Government workflow automation for gestores.",
		disabled: true,
		kicker: "Paused",
		label: "Consultapp",
		value: "consultapp",
	},
];

const stackOptions: DropdownOption[] = [
	{
		description: "Router, Query, Form, and Start experiments.",
		label: "TanStack",
		value: "tanstack",
	},
	{
		description: "Fast backend experiments with typed contracts.",
		label: "ElysiaJS",
		value: "elysia",
	},
	{
		description: "PHP production workhorse.",
		label: "Laravel",
		value: "laravel",
	},
	{
		description: "Styling system for this site.",
		label: "Tailwind CSS v4",
		value: "tailwind",
	},
];

export function DropdownsSection() {
	const [project, setProject] = useState<string | null>("ozmah-dev");
	const [stacks, setStacks] = useState(["tanstack", "tailwind"]);
	const [searchedProject, setSearchedProject] = useState<string | null>(
		"tesseract",
	);

	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Dropdown System
			</h2>
			<div className="grid gap-8 lg:grid-cols-3">
				<AperturePanel title="Single Select">
					<Select
						description="One selected value. Disabled options stay visible but unreachable."
						label="Primary Project"
						onValueChange={setProject}
						options={projectOptions}
						value={project}
					/>
					<Select
						disabled
						label="Disabled Project"
						onValueChange={setProject}
						options={projectOptions}
						value={project}
					/>
				</AperturePanel>

				<AperturePanel title="Multi Select">
					<MultiSelect
						description="Counter summary, persistent menu, and a clear action."
						label="Current Stack"
						onValuesChange={setStacks}
						options={stackOptions}
						values={stacks}
					/>
					<MultiSelect
						disabled
						label="Disabled Stack"
						onValuesChange={setStacks}
						options={stackOptions}
						values={stacks}
					/>
				</AperturePanel>

				<AperturePanel title="Combobox">
					<Combobox
						description="Searches rich option content but only commits existing options."
						label="Find Project"
						onValueChange={setSearchedProject}
						options={projectOptions}
						value={searchedProject}
					/>
					<Combobox
						disabled
						label="Disabled Search"
						onValueChange={setSearchedProject}
						options={projectOptions}
						value={searchedProject}
					/>
				</AperturePanel>
			</div>
		</section>
	);
}

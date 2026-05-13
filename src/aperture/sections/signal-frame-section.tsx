import { Button } from "@/components/ui/button";
import { SignalFrame } from "@/components/ui/signal-frame";
import { TextArea, TextInput } from "@/components/ui/text-field";

export function SignalFrameSection() {
	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Signal Frame
			</h2>
			<SignalWall />
			<div className="mt-8">
				<ArtifactContentPanel />
			</div>
		</section>
	);
}

function SignalWall() {
	return (
		<div className="border border-border-strong bg-background p-4 sm:p-5">
			<div className="mb-4 flex items-center justify-between gap-4 border-border border-b pb-3">
				<h3 className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
					Signal Wall
				</h3>
				<p className="m-0 font-oz-mono text-[0.65rem] text-dim uppercase tracking-[0.14em]">
					12 passive feeds
				</p>
			</div>
			<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
				{signalWallFeeds.map((feed, index) => (
					<SignalFrame
						aspect="wide"
						channels={[feed]}
						className="border-border bg-surface/40"
						intervalMs={5000 + index * 137}
						key={feed.id}
						tone={index % 5 === 0 ? "pink" : "lime"}
					/>
				))}
			</div>
		</div>
	);
}

function ArtifactContentPanel() {
	return (
		<div className="relative isolate overflow-hidden border border-border-strong bg-surface px-5 py-7 sm:px-8 sm:py-9">
			<BackgroundArtifact
				className="-top-8 -left-6 size-44 opacity-[0.045] sm:size-64"
				src="/artifacts/grace.svg"
			/>
			<BackgroundArtifact
				className="-right-8 -bottom-10 size-52 opacity-[0.04] sm:size-72"
				src="/artifacts/plasmid.svg"
			/>
			<div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
				<div>
					<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
						Operational content surface
					</p>
					<h3 className="mt-4 mb-0 max-w-3xl font-oz-display text-3xl text-foreground uppercase tracking-tight sm:text-5xl">
						Build the signal, then make it survive contact.
					</h3>
					<p className="mt-4 max-w-2xl text-muted leading-7">
						This is the kind of container the artifacts need to support: real
						text, structured copy, a small form, and decorative references that
						stay in the background unless you intentionally look for them.
					</p>
					<div className="mt-6 grid gap-3 sm:grid-cols-3">
						{contentStats.map((stat) => (
							<div
								className="border border-border bg-background/55 p-4"
								key={stat.label}
							>
								<p className="m-0 font-oz-mono text-[0.65rem] text-dim uppercase tracking-[0.14em]">
									{stat.label}
								</p>
								<p className="mt-2 mb-0 font-oz-display text-2xl text-accent uppercase">
									{stat.value}
								</p>
							</div>
						))}
					</div>
				</div>

				<form className="border border-border-strong bg-background/70 p-4 gap-4 sm:p-5">
					<div className="mb-4 flex items-center justify-between border-border border-b pb-3">
						<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
							Signal intake
						</p>
						<span className="font-oz-mono text-[0.65rem] text-dim uppercase tracking-[0.14em]">
							Draft
						</span>
					</div>
					<TextInput
						label="Transmission title"
						placeholder="Systems that endure"
					/>
					<TextArea
						className="min-h-28"
						label="Payload"
						placeholder="Write a note, a project pulse, or a small field report."
					/>
					<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
						<p className="m-0 font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.12em]">
							Artifacts remain decorative
						</p>
						<Button className="min-h-11 min-w-40 px-4 py-3" type="button">
							Queue signal
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

function BackgroundArtifact({
	className,
	src,
}: {
	className: string;
	src: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={`pointer-events-none absolute -z-10 block bg-current text-accent ${className}`}
			style={{
				mask: `url(${src}) center / contain no-repeat`,
				WebkitMask: `url(${src}) center / contain no-repeat`,
			}}
		/>
	);
}

const contentStats = [
	{ label: "Mode", value: "Build" },
	{ label: "Signal", value: "Stable" },
	{ label: "Output", value: "Ship" },
];

const signalWallFeeds = [
	{
		id: "wall-codec-01",
		label: "Codec",
		src: "/artifacts/codec.svg",
	},
	{
		id: "wall-heavy-02",
		label: "Heavy",
		mode: "mask" as const,
		src: "/artifacts/heavy-machinegun.svg",
	},
	{
		id: "wall-chicken-03",
		label: "Chicken",
		mode: "mask" as const,
		src: "/artifacts/wall-checken.svg",
	},
	{
		id: "wall-grace-04",
		label: "Grace",
		mode: "mask" as const,
		src: "/artifacts/grace.svg",
	},
	{
		id: "wall-heavy-05",
		label: "Heavy",
		mode: "mask" as const,
		src: "/artifacts/heavy-machinegun.svg",
	},
	{
		id: "wall-codec-06",
		label: "Codec",
		src: "/artifacts/codec.svg",
	},
	{
		id: "wall-chicken-07",
		label: "Chicken",
		mode: "mask" as const,
		src: "/artifacts/wall-checken.svg",
	},
	{
		id: "wall-grace-08",
		label: "Grace",
		mode: "mask" as const,
		src: "/artifacts/grace.svg",
	},
	{
		id: "wall-codec-09",
		label: "Codec",
		src: "/artifacts/codec.svg",
	},
	{
		id: "wall-heavy-10",
		label: "Heavy",
		mode: "mask" as const,
		src: "/artifacts/heavy-machinegun.svg",
	},
	{
		id: "wall-plasmid-11",
		label: "Plasmid",
		mode: "mask" as const,
		src: "/artifacts/plasmid.svg",
	},
	{
		id: "wall-chicken-12",
		label: "Chicken",
		mode: "mask" as const,
		src: "/artifacts/wall-checken.svg",
	},
];

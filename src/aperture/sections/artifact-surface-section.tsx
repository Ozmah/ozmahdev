import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/text-field";

export function ArtifactSurfaceSection() {
	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="mb-6 font-oz-mono text-oz-lime text-sm uppercase tracking-wider">
				Background Artwork
			</h2>
			<ArtifactContentPanel />
		</section>
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
					<h3 className="m-0 max-w-3xl font-oz-display text-3xl text-foreground uppercase tracking-tight sm:text-5xl">
						Decorative artwork in context
					</h3>
					<p className="mt-4 max-w-2xl text-muted leading-7">
						This sample checks how the artwork behaves behind a heading, body
						copy, summary values, and a compact form.
					</p>
					<div className="mt-6 grid gap-3 sm:grid-cols-3">
						{surfaceDetails.map((detail) => (
							<div
								className="border border-border bg-background/55 p-4"
								key={detail.label}
							>
								<p className="m-0 font-oz-mono text-[0.65rem] text-dim uppercase tracking-[0.14em]">
									{detail.label}
								</p>
								<p className="mt-2 mb-0 font-oz-display text-2xl text-accent uppercase">
									{detail.value}
								</p>
							</div>
						))}
					</div>
				</div>

				<form className="border border-border-strong bg-background/70 p-4 sm:p-5">
					<div className="mb-4 flex items-center justify-between border-border border-b pb-3">
						<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
							Form sample
						</p>
						<span className="font-oz-mono text-[0.65rem] text-dim uppercase tracking-[0.14em]">
							Idle
						</span>
					</div>
					<TextInput label="Title" placeholder="The cake is a lie" />
					<TextArea
						className="min-h-28"
						label="Notes"
						placeholder="Add a short project note."
					/>
					<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
						<p className="m-0 font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.12em]">
							Artwork stays in the background
						</p>
						<Button className="min-h-11 min-w-40 px-4 py-3" type="button">
							Save draft
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

const surfaceDetails = [
	{ label: "Layer", value: "Background" },
	{ label: "Opacity", value: "4–5%" },
	{ label: "Role", value: "Decorative" },
];

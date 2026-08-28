export function RedactedEntry() {
	return (
		<section className="border-border-strong border-t pt-10">
			<div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-12">
				<header>
					<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
						Redacted
					</p>
					<h2 className="mt-3 mb-0 font-oz-display text-4xl text-foreground uppercase leading-none tracking-[-0.05em] sm:text-6xl">
						Private work
					</h2>
				</header>

				<div className="max-w-3xl text-muted text-base leading-7">
					<p className="mt-0">
						Placeholder copy for projects I cannot name publicly yet. Replace
						this with a short explanation of the kind of work, the constraints,
						and what can be shared without exposing private details.
					</p>
					<p>
						Keep this section text only. No screenshots, no client names, no
						private identifiers, and no details that could reveal systems or
						business processes.
					</p>
				</div>
			</div>
		</section>
	);
}

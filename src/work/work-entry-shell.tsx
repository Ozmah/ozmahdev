import type { ReactNode } from "react";

interface WorkEntryShellProps {
	children: ReactNode;
	description: ReactNode;
	meta: string;
	title: string;
}

export function WorkEntryShell({
	children,
	description,
	meta,
	title,
}: WorkEntryShellProps) {
	return (
		<article className="border-border-strong border-t pt-10">
			<div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-12">
				<header>
					<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
						{meta}
					</p>
					<h2 className="mt-3 mb-0 font-oz-display text-4xl text-foreground uppercase leading-none tracking-[-0.05em] sm:text-6xl">
						{title}
					</h2>
				</header>

				<div className="max-w-3xl text-muted text-base leading-7">
					{description}
				</div>
			</div>

			<div className="mt-12">{children}</div>
		</article>
	);
}

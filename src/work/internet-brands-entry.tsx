import type { ReactNode } from "react";
import { WorkEntryShell } from "./work-entry-shell";
import { WorkImage } from "./work-image";

export function InternetBrandsEntry() {
	return (
		<WorkEntryShell
			description={
				<p className="mt-0">
					I worked on the public landing experience for Internet Brands across
					multiple versions. This was the first time I worked on a site with
					this scale and visibility.
				</p>
			}
			meta="2015 to date"
			title="Internet Brands"
		>
			<div className="grid gap-10">
				<WorkPhase description="" period="2015 to 2022" title="IB Landing">
					<WorkImage
						alt="Internet Brands landing page captured in 2015"
						caption="Main landing, 2015"
						height={1198}
						loading="eager"
						src="/work/ib-main-2015.png"
						width={1645}
					/>
					<WorkImage
						alt="Internet Brands work page captured in 2015"
						caption="Work page, 2015"
						height={1203}
						src="/work/ib-work-2015.png"
						width={1493}
					/>
				</WorkPhase>

				<WorkPhase
					description=""
					period="2023 to 2025"
					title="Redesign IB Landing"
				>
					<WorkImage
						alt="Renewed Internet Brands landing page captured in 2023"
						caption="Main landing, 2023"
						height={1197}
						src="/work/ib-main-2023.png"
						width={1607}
					/>
					<WorkImage
						alt="Renewed Internet Brands work page captured in 2023"
						caption="Work page, 2023"
						height={1202}
						src="/work/ib-work-2023.png"
						width={1691}
					/>
				</WorkPhase>
			</div>
		</WorkEntryShell>
	);
}

function WorkPhase({
	children,
	description,
	period,
	title,
}: {
	children: ReactNode;
	description: string;
	period: string;
	title: string;
}) {
	return (
		<section className="grid gap-5">
			<div className="grid gap-3 border-border border-t pt-5 sm:grid-cols-[0.32fr_1fr]">
				<div>
					<p className="m-0 font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.14em]">
						{period}
					</p>
					<h3 className="mt-2 mb-0 font-oz-display text-2xl text-foreground uppercase tracking-[-0.04em]">
						{title}
					</h3>
				</div>
				<p className="m-0 max-w-2xl text-muted leading-7">{description}</p>
			</div>

			<div className="grid gap-5 xl:grid-cols-2">{children}</div>
		</section>
	);
}

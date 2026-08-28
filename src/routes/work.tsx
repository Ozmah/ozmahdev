import { createFileRoute } from "@tanstack/react-router";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { PageContainer } from "@/shell/page-container";
import { ConsultappEntry } from "@/work/consultapp-entry";
import { InternetBrandsEntry } from "@/work/internet-brands-entry";
import { RedactedEntry } from "@/work/redacted-entry";
import { TodoEnLineaEntry } from "@/work/todoenlinea-entry";

export const Route = createFileRoute("/work")({
	component: WorkPage,
	head: () => ({
		meta: [
			{ title: "My Work | OzmahDev" },
			{
				name: "description",
				content:
					"Selected work by Gabriel Alegría, including Consultapp, TodoEnLinea, and Internet Brands landing pages.",
			},
		],
	}),
});

function WorkPage() {
	return (
		<PageContainer className="py-10 text-foreground sm:py-14 lg:py-20" variant="wide">
			<header className="flex items-start justify-between gap-8 border-border-strong border-b pb-10">
				<div className="max-w-3xl">
					<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
						OzmahDev / My Work
					</p>
					<h1 className="mt-4 mb-0 font-oz-display text-5xl text-foreground uppercase leading-none tracking-[-0.06em] text-balance sm:text-7xl">
						What's in Prod?
					</h1>
					<p className="mt-5 max-w-2xl text-muted text-base leading-7">
						Most of the work I do usually goes for private companies, but here's what I can share: public professional work, side projects, and things I built just for fun.
					</p>
				</div>
				<SiteNavigation />
			</header>

			<main className="grid gap-16 py-10 sm:gap-20 sm:py-14">
				<ConsultappEntry />
				<TodoEnLineaEntry />
				<InternetBrandsEntry />
				<RedactedEntry />
			</main>
		</PageContainer>
	);
}

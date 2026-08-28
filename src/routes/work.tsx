import { createFileRoute } from "@tanstack/react-router";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { createSeo } from "@/lib/seo";
import { PageContainer } from "@/shell/page-container";
import { WorkProject } from "@/work/work-project";

const description =
	"Selected work by Gabriel Alegría, including Consultapp, TodoEnLinea, Internet Brands, and tarkov.farm.";

export const Route = createFileRoute("/work")({
	component: WorkPage,
	head: () =>
		createSeo({
			description,
			path: "/work",
			title: "My Work | OzmahDev",
		}),
});

function WorkPage() {
	return (
		<PageContainer
			className="py-10 text-foreground sm:py-14 lg:py-20"
			variant="wide"
		>
			<header className="flex items-start justify-between gap-8 border-border-strong border-b pb-10">
				<div className="max-w-3xl">
					<h1 className="m-0 font-oz-display text-5xl text-foreground uppercase leading-none tracking-[-0.04em] text-balance sm:text-7xl">
						What's in Prod?
					</h1>
					<p className="mt-5 max-w-2xl text-muted text-base leading-7">
						Most of the work I do usually goes for private companies, but here's
						what I can share: public professional work, side projects, and
						things I built just for fun.
					</p>
				</div>
				<SiteNavigation />
			</header>

			<div className="grid gap-x-8 gap-y-16 py-10 sm:py-14 lg:grid-cols-2">
				<WorkProject
					alt="Consultapp commercial records dashboard"
					comment="Consultapp is an internal product for managing commercial records, users, ledgers, document generation, and the day to day work around those processes. Currently serving clients in all of Mexico for TodoEnLinea."
					height={1070}
					linkLabel="Private product"
					src="/images/work/consultapp.webp"
					title="Consultapp"
					width={1400}
				/>
				<WorkProject
					alt="TodoEnLinea landing page"
					comment="This is the landing page for TodoEnLinea. The page focuses on what matters: explain the offer, keep the page readable and make the next step obvious for the user."
					height={792}
					href="https://todoenlinea.app"
					linkLabel="todoenlinea.app"
					src="/images/work/todoenlinea.webp"
					title="TodoEnLinea"
					width={1400}
				/>
				<WorkProject
					alt="Internet Brands landing page captured in 2023"
					comment="I worked on the public landing experience for Internet Brands across multiple versions. This was the first time I worked on a site with this scale and visibility."
					height={1042}
					href="https://internetbrands.com"
					linkLabel="internetbrands.com"
					src="/images/work/internet-brands.webp"
					title="Internet Brands"
					width={1400}
				/>
				<WorkProject
					alt="tarkov.farm interactive map and document tracker"
					comment="Inspired by Christina Martinez's talk at Laracon 2026, I set out to build the best item locator I could make for Escape From Tarkov, and so I did. Free, private and open source."
					height={812}
					href="https://tarkov.farm"
					linkLabel="tarkov.farm"
					src="/images/work/tarkov-farm.webp"
					title="tarkov farm"
					width={1400}
				/>
			</div>
		</PageContainer>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { IdentityMark } from "#/home/identity-mark";
import { HomeNavigation } from "#/home/navigation";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/shell/page-container";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [
			{ title: "OzmahDev | Gabriel Alegría" },
			{
				name: "description",
				content:
					"Personal site of Gabriel Alegría, web developer and tinkerer.",
			},
		],
	}),
});

export function Home() {
	return (
		<PageContainer variant="home">
			<header className="flex items-start justify-between gap-8">
				<IdentityMark />
				<HomeNavigation />
			</header>

			<section className="grid content-start pt-16 sm:pt-20 lg:pt-24">
				<div className="max-w-136">
					<h1 className="font-oz-sans text-[clamp(1.35rem,1.16rem+0.8vw,1.9rem)] font-bold leading-tight tracking-[-0.04em] text-muted text-balance">
						Hi, I'm Gabriel, Web Developer and Tinkerer
					</h1>

					<div className="mt-8 max-w-124 space-y-6 text-[clamp(1rem,0.96rem+0.18vw,1.125rem)] text-muted leading-[1.45] tracking-[-0.035em]">
						<p>
							I'm a long time developer who loves learning about visuals and
							fixing worker queues.
						</p>
						<p>
							I'm currently a full stack engineer at Internet Brands, now
							working with the Content Team on Sequoia. Outside work, I'm
							building Consultapp, shaping ozmah.dev, and contributing to open
							source whenever I can.
						</p>
					</div>

					<div className="mt-20">
						<Button as="a" href="#my-work">
							What I do
						</Button>
					</div>
				</div>
			</section>
		</PageContainer>
	);
}

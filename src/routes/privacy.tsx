import { ArrowLeftIcon } from "@phosphor-icons/react/ArrowLeft";
import { createFileRoute, Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { createSeo } from "@/lib/seo";
import { PageContainer } from "@/shell/page-container";

const description = `How ${siteConfig.name} collects minimal, privacy-preserving website analytics.`;

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
	head: () =>
		createSeo({
			description,
			path: "/privacy",
			title: `Privacy | ${siteConfig.name}`,
		}),
});

function PrivacyPage() {
	return (
		<PageContainer className="py-10 text-foreground sm:py-14 lg:py-20">
			<header>
				<Link
					aria-label="Back to OzmahDev home"
					className="group -ml-3 inline-flex size-11 items-center justify-center text-dim no-underline transition-colors duration-150 ease-out hover:text-accent focus-visible:text-accent"
					to="/"
				>
					<ArrowLeftIcon
						aria-hidden="true"
						className="transition-transform duration-150 ease-out group-hover:-translate-x-1 group-focus-visible:-translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
						size={22}
						weight="regular"
					/>
				</Link>
			</header>

			<article className="mt-14 max-w-2xl sm:mt-20">
				<h1 className="m-0 font-oz-display text-2xl text-foreground tracking-[-0.035em] sm:text-3xl">
					Privacy, the short version
				</h1>

				<div className="mt-7 max-w-xl space-y-5 text-muted leading-7">
					<p>
						Site has analytics, using stuff like what people click, where visits
						come from. No cookies, session recordings, names, emails, or form
						data.
					</p>
					<p>
						If you have any questions, send me an email to{" "}
						<a className="text-accent" href={`mailto:${siteConfig.email}`}>
							{siteConfig.email}
						</a>
						.
					</p>
				</div>
			</article>
		</PageContainer>
	);
}

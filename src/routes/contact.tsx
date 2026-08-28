import { createFileRoute } from "@tanstack/react-router";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { siteConfig } from "@/config/site";
import { ContactLinks } from "@/contact/contact-links";
import { createSeo } from "@/lib/seo";
import { PageContainer } from "@/shell/page-container";

const description = `Contact ${siteConfig.owner} by email, LinkedIn, Twitter, or Discord.`;

export const Route = createFileRoute("/contact")({
	component: ContactPage,
	head: () =>
		createSeo({
			description,
			path: "/contact",
			title: `Contact | ${siteConfig.name}`,
		}),
});

function ContactPage() {
	return (
		<PageContainer variant="contact">
			<header className="flex items-start justify-between gap-8 border-border-strong border-b pb-10">
				<div>
					<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.16em]">
						OzmahDev / Contact
					</p>
					<h1 className="mt-4 mb-0 font-oz-display text-5xl text-foreground uppercase leading-none tracking-[-0.06em] sm:text-7xl">
						Contact
					</h1>
				</div>
				<SiteNavigation />
			</header>

			<div className="pt-12 sm:pt-16">
				<ContactLinks />
			</div>
		</PageContainer>
	);
}

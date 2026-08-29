import { createFileRoute } from "@tanstack/react-router";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { siteConfig } from "@/config/site";
import { ContactLinks } from "@/contact/contact-links";
import { IdentityMark } from "@/home/identity-mark";
import { createSeo } from "@/lib/seo";
import { PageContainer } from "@/shell/page-container";

const description = `Contact ${siteConfig.owner} by email, GitHub, LinkedIn, Twitter, or Discord.`;

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
		<PageContainer variant="home">
			<header className="flex items-start justify-between gap-8">
				<IdentityMark />
				<SiteNavigation />
			</header>

			<section className="grid content-start pt-16 sm:pt-20 lg:pt-24">
				<div className="max-w-136">
					<h1 className="font-oz-display text-[clamp(1.35rem,1.16rem+0.8vw,1.9rem)] font-bold leading-tight tracking-[-0.04em] text-muted text-balance">
						Get in touch or find me online!
					</h1>
					<ContactLinks />
				</div>
			</section>
		</PageContainer>
	);
}

import { siteConfig } from "@/config/site";

const contactLinks = [
	{
		href: `mailto:${siteConfig.email}`,
		label: "Email",
		value: siteConfig.email,
	},
	{
		href: siteConfig.social.linkedin,
		label: "LinkedIn",
		value: "gabriel-alegria-mx",
	},
	{
		href: siteConfig.social.twitter,
		label: "Twitter",
		value: "@OzmahG",
	},
	{
		href: siteConfig.social.discord,
		label: "Discord",
		value: "ozmah",
	},
] as const;

export function ContactLinks() {
	return (
		<address className="not-italic">
			<ul className="m-0 grid list-none p-0">
				{contactLinks.map((contact) => (
					<li className="border-border-strong border-t" key={contact.label}>
						<a
							className="group grid min-h-24 grid-cols-[0.35fr_1fr_auto] items-center gap-4 py-5 text-muted no-underline transition-colors duration-150 ease-out hover:text-accent focus-visible:text-accent sm:min-h-28"
							href={contact.href}
							rel={contact.label === "Email" ? undefined : "me"}
						>
							<span className="font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.14em]">
								{contact.label}
							</span>
							<span className="break-all font-oz-display text-xl tracking-[-0.03em] sm:text-3xl">
								{contact.value}
							</span>
							<span
								aria-hidden="true"
								className="font-oz-mono text-lg transition-transform duration-150 ease-out group-hover:translate-x-1"
							>
								↗
							</span>
						</a>
					</li>
				))}
			</ul>
		</address>
	);
}

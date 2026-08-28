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
		<address className="mt-8 not-italic">
			<ul className="m-0 grid list-none gap-3 p-0">
				{contactLinks.map((contact) => (
					<li key={contact.label}>
						<a
							className="group grid min-h-11 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 text-muted no-underline hover:text-accent focus-visible:text-accent"
							href={contact.href}
							rel={contact.label === "Email" ? undefined : "me"}
						>
							<span className="font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.1em] group-hover:text-accent group-focus-visible:text-accent">
								{contact.label}
							</span>
							<span className="break-all text-base tracking-[-0.025em] sm:text-lg">
								{contact.value}
							</span>
						</a>
					</li>
				))}
			</ul>
		</address>
	);
}

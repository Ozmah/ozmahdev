import { DiscordLogoIcon } from "@phosphor-icons/react/DiscordLogo";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/EnvelopeSimple";
import { GithubLogoIcon } from "@phosphor-icons/react/GithubLogo";
import { LinkedinLogoIcon } from "@phosphor-icons/react/LinkedinLogo";
import { XLogoIcon } from "@phosphor-icons/react/XLogo";
import { siteConfig } from "@/config/site";

const contactLinks = [
	{
		href: `mailto:${siteConfig.email}`,
		icon: EnvelopeSimpleIcon,
		label: "Email",
		value: siteConfig.email,
	},
	{
		href: siteConfig.social.github,
		icon: GithubLogoIcon,
		label: "GitHub",
		value: "Ozmah",
	},
	{
		href: siteConfig.social.linkedin,
		icon: LinkedinLogoIcon,
		label: "LinkedIn",
		value: "gabriel-alegria-mx",
	},
	{
		href: siteConfig.social.twitter,
		icon: XLogoIcon,
		label: "Twitter",
		value: "@OzmahG",
	},
	{
		href: siteConfig.social.discord,
		icon: DiscordLogoIcon,
		label: "Discord",
		value: "ozmah",
	},
] as const;

export function ContactLinks() {
	return (
		<address className="mt-8 not-italic">
			<ul className="m-0 grid list-none gap-3 p-0">
				{contactLinks.map((contact) => {
					const Icon = contact.icon;

					return (
						<li key={contact.label}>
							<a
								aria-label={`${contact.label}: ${contact.value}`}
								className="group grid min-h-11 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-4 text-muted no-underline hover:text-accent focus-visible:text-accent"
								href={contact.href}
								rel={contact.label === "Email" ? undefined : "me"}
							>
								<Icon
									aria-hidden="true"
									className="text-dim transition-colors duration-150 ease-out group-hover:text-accent group-focus-visible:text-accent"
									size={22}
									weight="regular"
								/>
								<span className="break-all text-base tracking-[-0.025em] sm:text-lg">
									{contact.value}
								</span>
							</a>
						</li>
					);
				})}
			</ul>
		</address>
	);
}

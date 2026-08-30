import { siteConfig } from "../config/site";

const SOCIAL_IMAGE_PATH = "/ozmah-dev-og.png";

interface SeoOptions {
	description: string;
	path: string;
	title: string;
}

export function createSeo({ description, path, title }: SeoOptions) {
	return {
		description,
		image: new URL(SOCIAL_IMAGE_PATH, siteConfig.url).toString(),
		imageAlt: "OzmahDev social card: Hi, I'm Gabriel. Mostly a web developer.",
		title,
		url: new URL(path, siteConfig.url).toString(),
	};
}

export function createPersonStructuredData() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		email: `mailto:${siteConfig.email}`,
		name: siteConfig.owner,
		sameAs: Object.values(siteConfig.social),
		url: siteConfig.url,
	};
}

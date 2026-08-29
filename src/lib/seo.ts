import { siteConfig } from "@/config/site";

const SOCIAL_IMAGE_PATH = "/ozmah-dev-og.png";

interface SeoOptions {
	description: string;
	path: string;
	title: string;
}

export function createSeo({ description, path, title }: SeoOptions) {
	const url = new URL(path, siteConfig.url).toString();
	const image = import.meta.env.DEV
		? SOCIAL_IMAGE_PATH
		: new URL(SOCIAL_IMAGE_PATH, siteConfig.url).toString();
	const imageAlt =
		"OzmahDev social card: Hi, I'm Gabriel. Mostly a web developer.";

	return {
		links: [{ rel: "canonical", href: url }],
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "author", content: siteConfig.owner },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:image", content: image },
			{ property: "og:image:alt", content: imageAlt },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:site_name", content: siteConfig.name },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: url },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:creator", content: "@OzmahG" },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
			{ name: "twitter:image:alt", content: imageAlt },
			{ name: "twitter:title", content: title },
			{ name: "twitter:url", content: url },
		],
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

import { siteConfig } from "@/config/site";

interface SeoOptions {
	description: string;
	path: string;
	title: string;
}

export function createSeo({ description, path, title }: SeoOptions) {
	const url = new URL(path, siteConfig.url).toString();
	const image = new URL("/me-anime.png", siteConfig.url).toString();

	return {
		links: [{ rel: "canonical", href: url }],
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "author", content: siteConfig.owner },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:image", content: image },
			{ property: "og:image:alt", content: "Portrait of Gabriel Alegría" },
			{ property: "og:image:height", content: "509" },
			{ property: "og:image:width", content: "509" },
			{ property: "og:site_name", content: siteConfig.name },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: url },
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:creator", content: "@OzmahG" },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
			{ name: "twitter:title", content: title },
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

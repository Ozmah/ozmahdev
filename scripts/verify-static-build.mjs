import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const appEnvironment = process.env.APP_ENV ?? "preview";
const analyticsExpected =
	appEnvironment === "production" &&
	Boolean(process.env.PUBLIC_POSTHOG_KEY?.trim());

const pages = {
	"404.html": { noindex: true, title: "Not Found | OzmahDev" },
	"aperture/index.html": { noindex: true, title: "The Lab | OzmahDev" },
	"contact/index.html": {
		canonical: "https://ozmah.dev/contact",
		currentNavigationHref: "/contact",
		title: "Contact | OzmahDev",
	},
	"index.html": {
		canonical: "https://ozmah.dev/",
		currentNavigationHref: "/",
		title: "OzmahDev | Gabriel Alegría",
	},
	"privacy/index.html": {
		canonical: "https://ozmah.dev/privacy",
		title: "Privacy | OzmahDev",
	},
	"work/index.html": {
		canonical: "https://ozmah.dev/work",
		currentNavigationHref: "/work",
		title: "My Work | OzmahDev",
	},
};

for (const [relativePath, expected] of Object.entries(pages)) {
	const html = read(relativePath);
	assert(count(html, "<title>") === 1, `${relativePath} must contain one title`);
	assert(
		html.includes(`<title>${expected.title}</title>`),
		`${relativePath} has an unexpected title`,
	);

	if (expected.canonical) {
		assert(
			html.includes(`rel="canonical" href="${expected.canonical}"`),
			`${relativePath} has an invalid canonical`,
		);
	}

	if (expected.currentNavigationHref) {
		const currentPageLinks = [
			...html.matchAll(/<a\b[^>]*\baria-current="page"[^>]*>/g),
		];
		assert(
			currentPageLinks.length === 1,
			`${relativePath} must contain one current navigation link`,
		);
		assert(
			currentPageLinks[0][0].includes(
				`href="${expected.currentNavigationHref}"`,
			),
			`${relativePath} has an invalid current navigation link`,
		);
	}

	const shouldNoIndex = expected.noindex || appEnvironment !== "production";
	assert(
		html.includes('name="robots" content="noindex, nofollow') ===
			shouldNoIndex,
		`${relativePath} has an invalid robots meta for ${appEnvironment}`,
	);

	for (const source of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
		const url = source[1];
		assert(!url.startsWith("http"), `${relativePath} loads a remote script`);
		assert(
			url.includes("ClientRouter") ||
				(analyticsExpected && url.includes("AnalyticsRuntime")) ||
				relativePath === "aperture/index.html",
			`${relativePath} loads unexpected JavaScript: ${url}`,
		);
	}
}

const home = read("index.html");
assert(home.includes('"@type":"Person"'), "home must include Person JSON-LD");

const robots = read("robots.txt");
assert(
	appEnvironment === "production"
		? robots.includes("Sitemap: https://ozmah.dev/sitemap.xml") &&
			!robots.includes("Disallow: /")
		: robots.includes("Disallow: /"),
	`robots.txt is invalid for ${appEnvironment}`,
);

const emittedText = walk(new URL("../dist/", import.meta.url))
	.filter((file) => /\.(?:css|html|js)$/.test(file))
	.map((file) => readFileSync(file, "utf8"))
	.join("\n");

assert(
	!emittedText.includes("fonts.googleapis.com") &&
		!emittedText.includes("fonts.gstatic.com"),
	"Google Fonts must remain self-hosted",
);

for (const license of [
	"barlow-condensed-OFL-1.1.txt",
	"chakra-petch-OFL-1.1.txt",
	"plus-jakarta-sans-OFL-1.1.txt",
]) {
	assert(
		existsSync(new URL(`../dist/licenses/fonts/${license}`, import.meta.url)),
		`missing font license: ${license}`,
	);
}

assert(
	walk(new URL("../dist/", import.meta.url)).every(
		(file) => !file.endsWith(".map") && !file.endsWith(".mjs"),
	),
	"static output must not contain source maps or server modules",
);

console.log(`Static ${appEnvironment} build verification passed`);

function read(relativePath) {
	return readFileSync(new URL(relativePath, dist), "utf8");
}

function count(value, needle) {
	return value.split(needle).length - 1;
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function walk(directoryUrl) {
	const directory = directoryUrl.pathname;
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);
		return statSync(path).isDirectory() ? walk(new URL(`${entry}/`, directoryUrl)) : path;
	});
}

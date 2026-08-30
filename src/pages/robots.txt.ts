import { APP_ENV } from "astro:env/server";

const isProduction = APP_ENV === "production";

export function GET() {
	const body = isProduction
		? "User-agent: *\nDisallow:\nSitemap: https://ozmah.dev/sitemap.xml\n"
		: "User-agent: *\nDisallow: /\n";

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}

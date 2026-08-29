import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const isDevelopment = process.env.NODE_ENV !== "production";

const securityHeaders = {
	"content-security-policy-report-only": [
		"default-src 'self'",
		"base-uri 'self'",
		"connect-src 'self'",
		"font-src 'self' https://fonts.gstatic.com data:",
		"form-action 'self'",
		"frame-ancestors 'none'",
		"img-src 'self' data:",
		"media-src 'self'",
		"object-src 'none'",
		"script-src 'self'",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"worker-src 'self' blob:",
	].join("; "),
	"cross-origin-opener-policy": "same-origin",
	"permissions-policy":
		"camera=(), geolocation=(), microphone=(), payment=(), usb=()",
	"referrer-policy": "strict-origin-when-cross-origin",
	"strict-transport-security": "max-age=31536000",
	"x-content-type-options": "nosniff",
	"x-frame-options": "DENY",
	"x-permitted-cross-domain-policies": "none",
} as const;

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools({
			eventBusConfig: {
				port: 1234,
				debug: false,
				enabled: isDevelopment,
			},
			editor: {
				name: "zed",
				open: async (path, lineNumber, columnNumber) => {
					const { spawn } = await import("node:child_process");
					const { isAbsolute, relative, resolve } = await import("node:path");
					const root = process.cwd();
					const target = resolve(path);
					const targetRelativePath = relative(root, target);

					if (
						targetRelativePath.startsWith("..") ||
						isAbsolute(targetRelativePath)
					) {
						return;
					}

					const position = lineNumber
						? `:${lineNumber}${columnNumber ? `:${columnNumber}` : ""}`
						: "";
					const child = spawn("zed", [`${target}${position}`], {
						detached: true,
						stdio: "ignore",
					});

					child.unref();
				},
			},
			removeDevtoolsOnBuild: true,
		}),
		nitro({
			preset: "bun",
			plugins: ["./server/plugins/robots.ts"],
			rollupConfig: { external: [/^@sentry\//] },
			routeRules: {
				"/**": {
					headers: securityHeaders,
				},
				"/assets/**": {
					headers: {
						"cache-control": "public, max-age=31536000, immutable",
					},
				},
				"/fonts/**": {
					headers: {
						"cache-control": "public, max-age=31536000",
					},
				},
				"/artifacts/**": {
					headers: {
						"cache-control": "public, max-age=86400",
					},
				},
				"/images/**": {
					headers: {
						"cache-control": "public, max-age=86400",
					},
				},
				"/favicon.ico": {
					headers: {
						"cache-control": "public, max-age=86400",
					},
				},
				"/site.webmanifest": {
					headers: {
						"cache-control": "public, max-age=86400",
					},
				},
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;

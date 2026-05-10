import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools({
			eventBusConfig: {
				port: 1234,
				debug: false,
				enabled: true,
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
			rollupConfig: { external: [/^@sentry\//] },
			routeRules: {
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
				"/*.svg": {
					headers: {
						"cache-control": "public, max-age=86400",
					},
				},
				"/*.png": {
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

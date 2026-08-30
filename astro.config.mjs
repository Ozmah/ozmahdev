// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "static",
	site: "https://ozmah.dev",
	trailingSlash: "never",
	env: {
		schema: {
			APP_ENV: envField.enum({
				context: "server",
				access: "public",
				values: ["preview", "production"],
				default: "preview",
			}),
			PUBLIC_POSTHOG_KEY: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			PUBLIC_POSTHOG_HOST: envField.string({
				context: "client",
				access: "public",
				url: true,
				default: "https://us.i.posthog.com",
			}),
		},
	},
	integrations: [react()],

	vite: {
		plugins: [tailwindcss()],
	},
});

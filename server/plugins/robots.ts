import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
	nitroApp.hooks.hook("response", (response) => {
		if (process.env.APP_ENV !== "production") {
			response.headers.set("x-robots-tag", "noindex, nofollow");
		}
	});
});

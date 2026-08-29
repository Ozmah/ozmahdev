import { createFileRoute } from "@tanstack/react-router";

const RESPONSE_HEADERS = {
	"cache-control": "no-store",
	"content-type": "application/json; charset=utf-8",
	"x-robots-tag": "noindex, nofollow",
};

export const Route = createFileRoute("/health")({
	server: {
		handlers: {
			GET: () =>
				Response.json({ status: "healthy" }, { headers: RESPONSE_HEADERS }),
		},
	},
});

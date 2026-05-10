import { createFileRoute } from "@tanstack/react-router";
import { AperturePage } from "@/aperture/aperture-page";

export const Route = createFileRoute("/aperture")({
	component: AperturePage,
});

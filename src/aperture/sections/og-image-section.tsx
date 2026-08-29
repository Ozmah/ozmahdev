import { OgImageGenerator } from "../og-image/og-image-generator";

export function OgImageSection() {
	return (
		<section className="border-oz-line border-t py-8" id="og-image-generator">
			<h2 className="mb-3 font-oz-mono text-oz-lime text-sm uppercase tracking-wider">
				OG Image Generator
			</h2>
			<p className="mt-0 mb-6 max-w-2xl text-muted text-sm leading-6">
				Renders the site's social preview as a fixed-size canvas, then exports
				that exact canvas as a PNG.
			</p>
			<OgImageGenerator />
		</section>
	);
}

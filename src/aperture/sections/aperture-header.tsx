import { TuiWordmark } from "@/components/brand/tui-wordmark";

export function ApertureHeader() {
	return (
		<header className="border-oz-line border-b pb-6">
			<p className="font-oz-mono text-oz-lime text-sm uppercase tracking-wider">
				OzmahDev / Aperture
			</p>
			<TuiWordmark className="mt-6 h-auto w-full max-w-3xl" text="The Lab" />
			<p className="font-oz-mono text-oz-muted mt-4 max-w-2xl text-base">
				Component lab. Break it here before it ships anywhere else.
			</p>
		</header>
	);
}

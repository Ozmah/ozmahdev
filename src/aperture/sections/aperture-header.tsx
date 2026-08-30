import { ArrowLeftIcon } from "@phosphor-icons/react/ArrowLeft";
import { TuiWordmark } from "../../components/react/brand/tui-wordmark";

export function ApertureHeader() {
	return (
		<header className="border-oz-line border-b pb-6">
			<nav aria-label="Breadcrumb">
				<ol className="m-0 flex list-none items-center gap-2 p-0 font-oz-mono text-sm uppercase tracking-wider">
					<li>
						<a
							aria-label="Back to OzmahDev home"
							className="group inline-flex min-h-11 items-center gap-2 text-oz-dim no-underline transition-colors duration-150 ease-out hover:text-oz-lime focus-visible:text-oz-lime"
							href="/"
						>
							<ArrowLeftIcon
								aria-hidden="true"
								className="transition-transform duration-150 ease-out group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
								size={16}
								weight="regular"
							/>
							OzmahDev
						</a>
					</li>
					<li aria-current="page" className="text-oz-lime">
						<span aria-hidden="true" className="mr-2 text-oz-dim">
							/
						</span>
						Aperture
					</li>
				</ol>
			</nav>
			<TuiWordmark
				cellSize={8}
				className="mt-6 h-auto max-w-full"
				letterGap={4}
				text="The Lab"
			/>
			<p className="font-oz-mono text-oz-muted mt-4 max-w-2xl text-base">
				Component lab. Only pieces for testing and experimenting, some of them
				were used to create the site.
			</p>
		</header>
	);
}

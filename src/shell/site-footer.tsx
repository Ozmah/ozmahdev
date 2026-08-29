import { ApertureIcon } from "@phosphor-icons/react/Aperture";
import { ArrowLeftIcon } from "@phosphor-icons/react/ArrowLeft";
import { Link, useLocation } from "@tanstack/react-router";

export function SiteFooter() {
	const isAperture = useLocation({
		select: (location) => location.pathname === "/aperture",
	});

	return (
		<footer className="px-5 sm:px-8 lg:px-0">
			<div className="mx-auto flex min-h-20 w-full max-w-5xl items-center justify-between">
				<p className="m-0 font-oz-mono text-dim text-xs tracking-[0.08em]">
					© Ozmah 2026
				</p>
				<Link
					aria-label={
						isAperture
							? "Back to OzmahDev home"
							: "Open the Aperture component lab"
					}
					className="group inline-flex size-11 items-center justify-center text-dim no-underline transition-colors duration-150 ease-out hover:text-accent focus-visible:text-accent"
					to={isAperture ? "/" : "/aperture"}
				>
					{isAperture ? (
						<ArrowLeftIcon
							aria-hidden="true"
							className="transition-transform duration-150 ease-out group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
							size={22}
							weight="regular"
						/>
					) : (
						<ApertureIcon
							aria-hidden="true"
							className="rotate-0 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-focus-visible:rotate-[360deg] motion-reduce:transform-none motion-reduce:transition-none"
							size={22}
							weight="regular"
						/>
					)}
				</Link>
			</div>
		</footer>
	);
}

const navigationLinkClassName =
	"inline-flex min-h-11 items-center text-muted no-underline transition-[color,transform,text-decoration-color] duration-150 ease-out hover:text-accent hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-4 focus-visible:text-accent";

export function HomeNavigation() {
	return (
		<nav aria-label="Primary navigation" className="pt-7 sm:pt-10 lg:pt-12">
			<ul className="m-0 flex list-none flex-col items-end gap-5 p-0 text-right font-oz-sans text-sm font-bold tracking-[-0.03em] text-muted sm:text-base">
				<li>
					<a className={navigationLinkClassName} href="#my-work">
						My Work
					</a>
				</li>
				<li>
					<a className={navigationLinkClassName} href="#aperture">
						The Lab
					</a>
				</li>
				<li>
					<a className={navigationLinkClassName} href="#about-me">
						About Me
					</a>
				</li>
			</ul>
		</nav>
	);
}

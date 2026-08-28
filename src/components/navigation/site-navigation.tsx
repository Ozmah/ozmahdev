import { Link } from "@tanstack/react-router";

const navigationLinkClassName =
	"inline-flex min-h-11 items-center text-muted no-underline transition-[color,transform,text-decoration-color] duration-150 ease-out hover:text-accent hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-4 focus-visible:text-accent";

export function SiteNavigation() {
	return (
		<nav aria-label="Primary navigation" className="pt-7 sm:pt-10 lg:pt-12">
			<ul className="m-0 flex list-none flex-col items-end gap-5 p-0 text-right font-oz-sans text-sm font-bold tracking-[-0.03em] text-muted sm:text-base">
			    <li>
					<Link className={navigationLinkClassName} to="/">
					Home
					</Link>
				</li>
				<li>
					<Link className={navigationLinkClassName} to="/work">
						My Work
					</Link>
				</li>
				<li>
					<a className={navigationLinkClassName} href="/contact">
					    Contact
					</a>
				</li>
			</ul>
		</nav>
	);
}

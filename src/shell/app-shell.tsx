import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="flex min-h-dvh flex-col">
			<main className="flex flex-1 flex-col" id="main-content">
				{children}
			</main>
			<SiteFooter />
		</div>
	);
}

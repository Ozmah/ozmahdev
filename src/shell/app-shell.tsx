import type { ReactNode } from "react";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<main className="oz-shell" id="main-content">
			{children}
		</main>
	);
}

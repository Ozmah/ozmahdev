import type { ReactNode } from "react";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<main className="min-h-dvh" id="main-content">
			{children}
		</main>
	);
}

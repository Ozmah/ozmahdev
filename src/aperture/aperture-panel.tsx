import type { ReactNode } from "react";

interface AperturePanelProps {
	children: ReactNode;
	title: string;
}

export function AperturePanel({ children, title }: AperturePanelProps) {
	return (
		<div className="border-oz-line bg-oz-surface flex min-h-72 flex-col gap-5 border p-5">
			<h2 className="font-oz-mono text-oz-lime text-sm uppercase tracking-wider">
				{title}
			</h2>
			<div className="flex flex-col items-start gap-4">{children}</div>
		</div>
	);
}

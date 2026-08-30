import type { ReactNode } from "react";

interface DropdownFieldShellProps {
	children: ReactNode;
	description?: string;
	descriptionId?: string;
	error?: string;
	errorId?: string;
	id: string;
	label: string;
	reserveMetaSpace?: boolean;
}

export function DropdownFieldShell({
	children,
	description,
	descriptionId,
	error,
	errorId,
	id,
	label,
	reserveMetaSpace = true,
}: DropdownFieldShellProps) {
	return (
		<div className="grid w-full max-w-[32rem] gap-2">
			<label
				className="font-oz-mono text-accent text-xs font-bold leading-tight tracking-[0.12em] uppercase"
				htmlFor={id}
				id={`${id}-label`}
			>
				{label}
			</label>
			{children}
			<div className={reserveMetaSpace ? "min-h-11" : undefined}>
				{description ? (
					<p
						className="m-0 font-oz-mono text-muted text-[0.8125rem] leading-[1.45]"
						id={descriptionId}
					>
						{description}
					</p>
				) : null}
				{error ? (
					<p
						className="m-0 font-oz-mono text-accent-strong text-[0.8125rem] leading-[1.45]"
						id={errorId}
					>
						{error}
					</p>
				) : null}
			</div>
		</div>
	);
}

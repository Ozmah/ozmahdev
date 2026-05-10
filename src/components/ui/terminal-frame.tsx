import type { ReactNode } from "react";

type TerminalVariant = "minimal" | "powershell" | "ubuntu";
type TerminalLineTone = "command" | "muted" | "normal" | "success";

interface TerminalFrameProps {
	ariaLabel?: string;
	children: ReactNode;
	className?: string;
	title: string;
	variant?: TerminalVariant;
}

interface TerminalLineProps {
	children: ReactNode;
	tone?: TerminalLineTone;
}

interface PowerlinePromptProps {
	path: string;
	time?: string;
}

export function TerminalFrame({
	ariaLabel,
	children,
	className,
	title,
	variant = "minimal",
}: TerminalFrameProps) {
	const classes = ["oz-terminal", `oz-terminal--${variant}`, className]
		.filter(Boolean)
		.join(" ");

	return (
		<section aria-label={ariaLabel ?? title} className={classes}>
			<div aria-hidden="true" className="oz-terminal__chrome">
				<div className="oz-terminal__tab">
					<span className="oz-terminal__icon">{getTerminalIcon(variant)}</span>
					<span className="oz-terminal__title">{title}</span>
				</div>
				<div className="oz-terminal__toolbar">
					<span>+</span>
					<span>⌄</span>
				</div>
				<div className="oz-terminal__window-controls">
					<span className="oz-terminal__control">−</span>
					<span className="oz-terminal__control">□</span>
					<span className="oz-terminal__control oz-terminal__control--close">
						×
					</span>
				</div>
			</div>
			<div className="oz-terminal__body">{children}</div>
		</section>
	);
}

export function TerminalLine({ children, tone = "normal" }: TerminalLineProps) {
	const classes = [
		"oz-terminal__line",
		tone !== "normal" ? `oz-terminal__line--${tone}` : undefined,
	]
		.filter(Boolean)
		.join(" ");

	return <p className={classes}>{children}</p>;
}

export function PowerlinePrompt({ path, time }: PowerlinePromptProps) {
	return (
		<div className="oz-powerline" role="presentation">
			<span className="oz-powerline__prompt">›</span>
			<span className="oz-powerline__segment">~</span>
			<span className="oz-powerline__segment oz-powerline__segment--path">
				{path}
			</span>
			{time ? (
				<span className="oz-powerline__segment oz-powerline__segment--time">
					{time}
				</span>
			) : null}
		</div>
	);
}

export function TerminalCursor() {
	return <span aria-hidden="true" className="oz-terminal__cursor" />;
}

function getTerminalIcon(variant: TerminalVariant) {
	if (variant === "powershell") {
		return ">";
	}

	if (variant === "ubuntu") {
		return "◌";
	}

	return "$_";
}

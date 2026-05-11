import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

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
	return (
		<section
			aria-label={ariaLabel ?? title}
			className={cn(
				"w-full max-w-3xl overflow-hidden border border-border-strong font-oz-mono text-foreground",
				terminalFrameVariants[variant],
				className,
			)}
		>
			<div
				aria-hidden="true"
				className={cn(
					"flex min-h-[2.65rem] items-stretch border-white/10 border-b",
					terminalChromeVariants[variant],
				)}
			>
				<div
					className={cn(
						"flex min-w-44 items-center gap-2 px-3",
						terminalTabVariants[variant],
					)}
				>
					<span
						className={cn(
							"inline-flex size-4 items-center justify-center bg-accent text-[0.65rem] font-extrabold leading-none text-background",
							terminalIconVariants[variant],
						)}
					>
						{getTerminalIcon(variant)}
					</span>
					<span className="overflow-hidden text-ellipsis whitespace-nowrap font-bold text-[0.8rem] text-foreground">
						{title}
					</span>
				</div>
				<div className="flex items-center gap-3 border-white/10 border-l px-3 text-muted">
					<span>+</span>
					<span>⌄</span>
				</div>
				<div className="ml-auto grid grid-cols-[repeat(3,2.75rem)]">
					<span className="inline-flex items-center justify-center text-sm text-foreground">
						−
					</span>
					<span className="inline-flex items-center justify-center text-sm text-foreground">
						□
					</span>
					<span className="inline-flex items-center justify-center bg-[#c42b1c] text-sm text-white">
						×
					</span>
				</div>
			</div>
			<div className="min-h-64 p-4">{children}</div>
		</section>
	);
}

export function TerminalLine({ children, tone = "normal" }: TerminalLineProps) {
	return (
		<p
			className={cn(
				"m-0 whitespace-pre-wrap text-[0.95rem] leading-[1.65] text-muted",
				terminalLineTones[tone],
			)}
		>
			{children}
		</p>
	);
}

export function PowerlinePrompt({ path, time }: PowerlinePromptProps) {
	return (
		<div
			aria-hidden="true"
			className="mb-3 flex items-center gap-[0.15rem] text-sm leading-none"
		>
			<span className="font-extrabold text-[#8cff00]">›</span>
			<span
				className={cn(powerlineSegmentClassName, "bg-muted text-background")}
			>
				~
			</span>
			<span
				className={cn(powerlineSegmentClassName, "bg-[#3b4252] text-white")}
			>
				{path}
			</span>
			{time ? (
				<span
					className={cn(
						powerlineSegmentClassName,
						"ml-auto bg-foreground text-background",
					)}
				>
					{time}
				</span>
			) : null}
		</div>
	);
}

export function TerminalCursor() {
	return (
		<span
			aria-hidden="true"
			className="ml-1.5 inline-block h-[1.15em] w-[0.55rem] translate-y-[0.2em] bg-[#7c3aed]"
		/>
	);
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

const terminalFrameVariants: Record<TerminalVariant, string> = {
	minimal: "bg-surface",
	powershell: "bg-[#080808]",
	ubuntu: "bg-[#211f2d]",
};

const terminalChromeVariants: Record<TerminalVariant, string> = {
	minimal: "bg-surface-raised",
	powershell: "bg-[#2f2f2f]",
	ubuntu: "bg-[#2f2d33]",
};

const terminalTabVariants: Record<TerminalVariant, string> = {
	minimal: "bg-transparent",
	powershell: "bg-[#151515]",
	ubuntu: "bg-[#211f2d]",
};

const terminalIconVariants: Record<TerminalVariant, string> = {
	minimal: "",
	powershell: "bg-[#3b82f6] text-white",
	ubuntu: "bg-[#e95420] text-white",
};

const terminalLineTones: Record<TerminalLineTone, string> = {
	command: "text-foreground",
	muted: "text-dim",
	normal: "",
	success: "text-accent",
};

const powerlineSegmentClassName =
	"powerline-segment px-[0.95rem] py-[0.35rem] font-extrabold";

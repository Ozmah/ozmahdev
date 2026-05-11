import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	icon?: ReactNode;
	variant?: ButtonVariant;
}

export function Button({
	children,
	className,
	icon = "→",
	type = "button",
	variant = "primary",
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				"group inline-flex min-h-15 min-w-48 cursor-pointer items-center justify-center gap-4 border px-6 py-4 font-oz-action font-black text-[clamp(1rem,0.92rem+0.4vw,1.25rem)] leading-none tracking-[0.02em] uppercase transition-[background-color,border-color,color,transform] duration-200 ease-out hover:enabled:-translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
				buttonVariants[variant],
				className,
			)}
			type={type}
			{...props}
		>
			<span>{children}</span>
			{icon ? (
				<span className="inline-flex font-oz-mono text-[1.35em] leading-none transition-transform duration-150 ease-out group-hover:translate-x-1 group-disabled:translate-x-0">
					{icon}
				</span>
			) : null}
		</button>
	);
}

const buttonVariants: Record<ButtonVariant, string> = {
	primary:
		"border-accent bg-accent text-background hover:enabled:border-accent-strong hover:enabled:bg-accent-strong",
	secondary:
		"border-border-strong bg-transparent text-foreground hover:enabled:border-foreground hover:enabled:text-accent-strong",
	tertiary:
		"border-accent-strong bg-transparent text-accent-strong hover:enabled:bg-accent-strong hover:enabled:text-background",
};

import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ReactNode,
} from "react";
import { cn } from "../cn";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonBaseProps {
	children: ReactNode;
	icon?: ReactNode;
	variant?: ButtonVariant;
}

type ButtonProps = ButtonBaseProps &
	ButtonHTMLAttributes<HTMLButtonElement> & {
		as?: "button";
	};

type ButtonAnchorProps = ButtonBaseProps &
	AnchorHTMLAttributes<HTMLAnchorElement> & {
		as: "a";
	};

export function Button({
	as = "button",
	children,
	className,
	icon = "→",
	variant = "primary",
	...props
}: ButtonProps | ButtonAnchorProps) {
	const buttonClassName = cn(
		"group inline-flex min-h-15 min-w-48 cursor-pointer items-center justify-center gap-4 border px-6 py-4 font-oz-action font-black text-[clamp(1rem,0.92rem+0.4vw,1.25rem)] leading-none tracking-[0.02em] uppercase transition-[background-color,border-color,color,transform] duration-200 ease-out hover:enabled:-translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
		buttonVariants[variant],
		className,
	);

	const content = (
		<>
			<span>{children}</span>
			{icon ? (
				<span className="inline-flex font-oz-mono text-[1.35em] leading-none transition-transform duration-150 ease-out group-hover:translate-x-1 group-disabled:translate-x-0">
					{icon}
				</span>
			) : null}
		</>
	);

	if (as === "a") {
		const { rel, target, ...anchorProps } =
			props as AnchorHTMLAttributes<HTMLAnchorElement>;

		return (
			<a
				className={buttonClassName}
				rel={getSafeRel({ rel, target })}
				target={target}
				{...anchorProps}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			className={buttonClassName}
			{...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
			type={(props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
		>
			{content}
		</button>
	);
}

function getSafeRel({
	rel,
	target,
}: {
	rel?: string;
	target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}) {
	if (target !== "_blank") {
		return rel;
	}

	const tokens = new Set((rel ?? "").split(" ").filter(Boolean));
	tokens.add("noopener");
	tokens.add("noreferrer");

	return Array.from(tokens).join(" ");
}

const buttonVariants: Record<ButtonVariant, string> = {
	primary:
		"border-accent bg-accent text-background hover:enabled:border-accent-strong hover:enabled:bg-accent-strong",
	secondary:
		"border-border-strong bg-transparent text-foreground hover:enabled:border-foreground hover:enabled:text-accent-strong",
	tertiary:
		"border-accent-strong bg-transparent text-accent-strong hover:enabled:bg-accent-strong hover:enabled:text-background",
};

import type { ButtonHTMLAttributes, ReactNode } from "react";

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
	const classes = ["oz-button", `oz-button--${variant}`, className]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classes} type={type} {...props}>
			<span>{children}</span>
			{icon ? <span className="oz-button__icon">{icon}</span> : null}
		</button>
	);
}

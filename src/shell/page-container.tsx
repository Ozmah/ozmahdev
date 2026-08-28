import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type PageContainerVariant = "full" | "home" | "wide" | "wider";

interface PageContainerProps extends ComponentPropsWithoutRef<"div"> {
	variant?: PageContainerVariant;
}

export function PageContainer({
	children,
	className,
	variant = "wide",
	...props
}: PageContainerProps) {
	return (
		<div className={cn(pageContainerVariants[variant], className)} {...props}>
			{children}
		</div>
	);
}

const pageContainerVariants: Record<PageContainerVariant, string> = {
	full: "min-h-dvh w-full",
	home: "mx-auto grid min-h-dvh w-full max-w-5xl grid-rows-[auto_1fr] bg-background px-5 py-10 text-foreground sm:px-8 sm:py-14 lg:px-0 lg:py-20",
	wide: "mx-auto min-h-dvh w-full max-w-7xl px-5 sm:px-8 lg:px-12",
	wider: "mx-auto min-h-dvh w-full max-w-7/10 px-5 sm:px-8 lg:px-12",
};

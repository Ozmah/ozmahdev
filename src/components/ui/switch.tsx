import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface SwitchProps
	extends Omit<
		ButtonHTMLAttributes<HTMLButtonElement>,
		"children" | "onChange" | "role" | "type"
	> {
	checked: boolean;
	checkedLabel?: string;
	description?: string;
	error?: string;
	label: string;
	onCheckedChange: (checked: boolean) => void;
	uncheckedLabel?: string;
}

export function Switch({
	checked,
	checkedLabel = "ON",
	className,
	description,
	disabled,
	error,
	id,
	label,
	onCheckedChange,
	onClick,
	uncheckedLabel = "OFF",
	...props
}: SwitchProps) {
	const generatedId = useId();
	const switchId = id ?? generatedId;
	const descriptionId = description ? `${switchId}-description` : undefined;
	const errorId = error ? `${switchId}-error` : undefined;
	const stateId = `${switchId}-state`;
	const describedBy = [descriptionId, errorId, props["aria-describedby"]]
		.filter(Boolean)
		.join(" ");
	const stateLabel = checked ? checkedLabel : uncheckedLabel;

	function handleClick(event: MouseEvent<HTMLButtonElement>) {
		onClick?.(event);

		if (event.defaultPrevented || disabled) {
			return;
		}

		onCheckedChange(!checked);
	}

	return (
		<div className="flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-2">
			<label
				className="font-oz-mono text-accent text-xs font-bold leading-tight tracking-[0.12em] uppercase"
				htmlFor={switchId}
				id={`${switchId}-label`}
			>
				{label}
			</label>
			<button
				aria-checked={checked}
				aria-describedby={describedBy || undefined}
				aria-invalid={Boolean(error) || undefined}
				aria-labelledby={`${switchId}-label ${stateId}`}
				className={cn(
					switchControlClassName,
					checked
						? "border-accent bg-surface text-accent"
						: "border-border-strong bg-background text-muted hover:enabled:border-foreground",
					className,
				)}
				disabled={disabled}
				id={switchId}
				onClick={handleClick}
				role="switch"
				type="button"
				{...props}
			>
				<span
					aria-hidden="true"
					className={cn(
						switchThumbClassName,
						checked
							? "col-start-1 justify-self-start border-accent bg-accent text-background"
							: "col-start-3 justify-self-end border-border-strong bg-surface-raised text-accent",
					)}
				>
					{checked ? "▐" : "▌"}
				</span>
				<span
					className={cn(
						"col-start-2 row-start-1 truncate px-3",
						checked ? "text-right" : "text-left",
					)}
					id={stateId}
				>
					{stateLabel}
				</span>
			</button>
			<div className="min-h-11 basis-full">
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

const switchControlClassName =
	"grid min-h-13 w-44 max-w-full shrink-0 cursor-pointer grid-cols-[2.25rem_1fr_2.25rem] items-center border px-2 py-2 font-oz-mono text-sm font-bold leading-none tracking-[0.12em] uppercase transition-[background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-dim aria-invalid:border-accent-strong aria-invalid:ring-1 aria-invalid:ring-accent-strong sm:w-48";

const switchThumbClassName =
	"row-start-1 inline-flex h-8 w-7 items-center justify-center border font-black transition-[background-color,border-color,color,transform] duration-200 ease-out";

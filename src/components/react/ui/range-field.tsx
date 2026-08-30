import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "../cn";

interface RangeFieldProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"children" | "max" | "min" | "onChange" | "type" | "value"
	> {
	description?: string;
	label: string;
	max: number;
	min: number;
	onValueChange: (value: number) => void;
	step?: number;
	unit?: string;
	value: number;
}

export function RangeField({
	className,
	description,
	id,
	label,
	max,
	min,
	onValueChange,
	step = 1,
	unit = "",
	value,
	...props
}: RangeFieldProps) {
	const generatedId = useId();
	const rangeId = id ?? generatedId;
	const descriptionId = description ? `${rangeId}-description` : undefined;
	const displayValue = `${value}${unit}`;

	return (
		<div className="grid w-full gap-2">
			<div className="flex items-center justify-between gap-4">
				<label
					className="font-oz-mono text-accent text-xs font-bold leading-tight tracking-[0.12em] uppercase"
					htmlFor={rangeId}
				>
					{label}
				</label>
				<output
					className="font-oz-mono text-muted text-xs tabular-nums"
					htmlFor={rangeId}
				>
					{displayValue}
				</output>
			</div>
			<input
				aria-describedby={descriptionId}
				className={cn(rangeControlClassName, className)}
				id={rangeId}
				max={max}
				min={min}
				onChange={(event) => {
					onValueChange(
						clampValue(event.currentTarget.valueAsNumber, min, max),
					);
				}}
				step={step}
				type="range"
				value={value}
				{...props}
			/>
			<div className="min-h-9">
				{description ? (
					<p
						className="m-0 font-oz-mono text-muted text-[0.75rem] leading-[1.45]"
						id={descriptionId}
					>
						{description}
					</p>
				) : null}
			</div>
		</div>
	);
}

function clampValue(value: number, min: number, max: number) {
	if (Number.isNaN(value)) {
		return min;
	}

	return Math.min(Math.max(value, min), max);
}

const rangeControlClassName =
	"h-11 w-full cursor-pointer accent-accent disabled:cursor-not-allowed disabled:opacity-45";

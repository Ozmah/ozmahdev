import type {
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";
import { useId } from "react";
import { cn } from "../cn";

type TextInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"children"
> & {
	description?: string;
	error?: string;
	label: string;
};

type TextAreaProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	"children"
> & {
	description?: string;
	error?: string;
	label: string;
};

export function TextInput({
	className,
	description,
	error,
	id,
	label,
	type = "text",
	...props
}: TextInputProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const errorId = error ? `${inputId}-error` : undefined;
	const describedBy = [descriptionId, errorId, props["aria-describedby"]]
		.filter(Boolean)
		.join(" ");
	const classes = cn(fieldControlClassName, className);

	return (
		<Field
			description={description}
			descriptionId={descriptionId}
			error={error}
			errorId={errorId}
			id={inputId}
			label={label}
		>
			<input
				aria-describedby={describedBy || undefined}
				aria-invalid={Boolean(error) || undefined}
				className={classes}
				id={inputId}
				type={type}
				{...props}
			/>
		</Field>
	);
}

export function TextArea({
	className,
	description,
	error,
	id,
	label,
	...props
}: TextAreaProps) {
	const generatedId = useId();
	const textareaId = id ?? generatedId;
	const descriptionId = description ? `${textareaId}-description` : undefined;
	const errorId = error ? `${textareaId}-error` : undefined;
	const describedBy = [descriptionId, errorId, props["aria-describedby"]]
		.filter(Boolean)
		.join(" ");
	const classes = cn(fieldControlClassName, "min-h-40 resize-y", className);

	return (
		<Field
			description={description}
			descriptionId={descriptionId}
			error={error}
			errorId={errorId}
			id={textareaId}
			label={label}
		>
			<textarea
				aria-describedby={describedBy || undefined}
				aria-invalid={Boolean(error) || undefined}
				className={classes}
				id={textareaId}
				{...props}
			/>
		</Field>
	);
}

function Field({
	children,
	description,
	descriptionId,
	error,
	errorId,
	id,
	label,
}: {
	children: ReactNode;
	description?: string;
	descriptionId?: string;
	error?: string;
	errorId?: string;
	id: string;
	label: string;
}) {
	return (
		<div className="grid w-full max-w-[32rem] gap-2">
			<label
				className="font-oz-mono text-accent text-xs font-bold leading-tight tracking-[0.12em] uppercase"
				htmlFor={id}
			>
				{label}
			</label>
			{children}
			<div className="min-h-11">
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

const fieldControlClassName =
	"min-h-13 w-full border border-border-strong bg-background px-4 py-[0.85rem] font-oz-sans text-base leading-6 text-foreground transition-[background-color,border-color,box-shadow,color] duration-200 ease-out placeholder:text-dim focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-dim aria-invalid:border-accent-strong aria-invalid:ring-1 aria-invalid:ring-accent-strong";

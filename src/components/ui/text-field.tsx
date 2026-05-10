import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";

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
	const classes = ["oz-field__control", className].filter(Boolean).join(" ");

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
	const classes = [
		"oz-field__control",
		"oz-field__control--textarea",
		className,
	]
		.filter(Boolean)
		.join(" ");

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
	children: React.ReactNode;
	description?: string;
	descriptionId?: string;
	error?: string;
	errorId?: string;
	id: string;
	label: string;
}) {
	return (
		<div className="oz-field">
			<label className="oz-field__label" htmlFor={id}>
				{label}
			</label>
			{children}
			{description ? (
				<p className="oz-field__description" id={descriptionId}>
					{description}
				</p>
			) : null}
			{error ? (
				<p className="oz-field__error" id={errorId}>
					{error}
				</p>
			) : null}
		</div>
	);
}

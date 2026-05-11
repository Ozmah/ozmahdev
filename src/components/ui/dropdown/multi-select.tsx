import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { DropdownFieldShell } from "./dropdown-field";
import {
	DropdownCaret,
	dropdownControlClassName,
	dropdownPanelClassName,
	focusElement,
	getActiveDescendantId,
	getAnchorStyle,
	getDescribedBy,
	getInitialActiveIndex,
	handleListNavigation,
	optionBaseClassName,
	renderOptionContent,
	useAnchoredPopover,
} from "./dropdown-primitives";
import type { DropdownFieldProps, DropdownOption } from "./types";

interface MultiSelectProps extends DropdownFieldProps {
	onValuesChange: (values: string[]) => void;
	options: DropdownOption[];
	placeholder?: string;
	values: string[];
}

export function MultiSelect({
	description,
	disabled,
	error,
	id,
	label,
	onValuesChange,
	options,
	placeholder = "No options selected",
	values,
}: MultiSelectProps) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;
	const listboxId = `${fieldId}-listbox`;
	const descriptionId = description ? `${fieldId}-description` : undefined;
	const errorId = error ? `${fieldId}-error` : undefined;
	const listboxRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const { anchorName, open, popoverRef, setOpen } = useAnchoredPopover();
	const selectedValues = new Set(values);
	const summary = getMultiSelectSummary(options, values, placeholder);

	function openList() {
		if (disabled) {
			return;
		}

		setActiveIndex(getInitialActiveIndex(options, values[0] ?? null));
		setOpen(true);
		focusElement(listboxRef);
	}

	function closeList() {
		setOpen(false);
		focusElement(triggerRef);
	}

	function toggleOption(index: number | null) {
		if (index === null) {
			return;
		}

		const option = options[index];

		if (!option || option.disabled) {
			return;
		}

		if (selectedValues.has(option.value)) {
			onValuesChange(values.filter((value) => value !== option.value));
			return;
		}

		onValuesChange([...values, option.value]);
	}

	function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
			event.preventDefault();
			openList();
		}
	}

	return (
		<DropdownFieldShell
			description={description}
			descriptionId={descriptionId}
			error={error}
			errorId={errorId}
			id={fieldId}
			label={label}
		>
			<button
				aria-label={`${label}: ${summary}`}
				aria-controls={listboxId}
				aria-describedby={getDescribedBy(descriptionId, errorId)}
				aria-expanded={open}
				aria-haspopup="listbox"
				aria-invalid={Boolean(error) || undefined}
				className={dropdownControlClassName}
				disabled={disabled}
				id={fieldId}
				onClick={() => (open ? closeList() : openList())}
				onKeyDown={handleTriggerKeyDown}
				ref={triggerRef}
				style={getAnchorStyle(anchorName)}
				type="button"
			>
				<span className={cn(values.length === 0 && "text-dim")}>{summary}</span>
				<DropdownCaret open={open} />
			</button>

			<div
				className="dropdown-popover z-50 mt-1"
				popover="auto"
				ref={popoverRef}
				style={getAnchorStyle(anchorName)}
			>
				<div className={dropdownPanelClassName}>
					<div
						aria-activedescendant={getActiveDescendantId(fieldId, activeIndex)}
						aria-labelledby={`${fieldId}-label`}
						aria-multiselectable="true"
						id={listboxId}
						onKeyDown={(event) =>
							handleListNavigation({
								activeIndex,
								close: closeList,
								event,
								onSelectActive: () => toggleOption(activeIndex),
								options,
								setActiveIndex,
							})
						}
						ref={listboxRef}
						role="listbox"
						tabIndex={-1}
					>
						{options.map((option, index) => {
							const selected = selectedValues.has(option.value);

							return (
								<button
									aria-disabled={option.disabled || undefined}
									aria-selected={selected}
									className={cn(
										optionBaseClassName,
										"border-b last:border-b-0",
										selected && "text-accent",
									)}
									data-active={activeIndex === index}
									data-disabled={option.disabled || undefined}
									disabled={option.disabled}
									id={`${fieldId}-option-${index}`}
									key={option.value}
									onClick={() => toggleOption(index)}
									onMouseEnter={() => !option.disabled && setActiveIndex(index)}
									onMouseDown={(event) => event.preventDefault()}
									role="option"
									type="button"
								>
									<span className="grid grid-cols-[2rem_1fr] gap-3">
										<span
											aria-hidden="true"
											className="whitespace-nowrap font-oz-mono text-accent"
										>
											{selected ? "[x]" : "[ ]"}
										</span>
										<span className="grid gap-1">
											{renderOptionContent(option)}
										</span>
									</span>
								</button>
							);
						})}
					</div>
					<div className="border-border border-t p-3">
						<button
							className="font-oz-mono text-dim text-xs uppercase tracking-[0.12em] hover:enabled:text-accent disabled:cursor-not-allowed disabled:opacity-45"
							disabled={values.length === 0}
							onClick={() => onValuesChange([])}
							onMouseDown={(event) => event.preventDefault()}
							type="button"
						>
							Clear selection
						</button>
					</div>
				</div>
			</div>
		</DropdownFieldShell>
	);
}

function getMultiSelectSummary(
	options: DropdownOption[],
	values: string[],
	placeholder: string,
) {
	if (values.length === 0) {
		return placeholder;
	}

	if (values.length === 1) {
		return (
			options.find((option) => option.value === values[0])?.label ??
			"1 selected"
		);
	}

	return `${values.length} selected`;
}

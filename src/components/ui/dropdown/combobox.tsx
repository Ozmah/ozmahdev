import type { ChangeEvent, KeyboardEvent } from "react";
import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { DropdownFieldShell } from "./dropdown-field";
import {
	dropdownControlClassName,
	dropdownPanelClassName,
	getActiveDescendantId,
	getAnchorStyle,
	getBoundaryActiveIndex,
	getDescribedBy,
	getInitialActiveIndex,
	getNextActiveIndex,
	getOptionLabel,
	matchesSearch,
	optionBaseClassName,
	renderOptionContent,
	useAnchoredPopover,
} from "./dropdown-primitives";
import type { DropdownFieldProps, DropdownOption } from "./types";

interface ComboboxProps extends DropdownFieldProps {
	emptyMessage?: string;
	onValueChange: (value: string) => void;
	options: DropdownOption[];
	placeholder?: string;
	value: string | null;
}

export function Combobox({
	description,
	disabled,
	emptyMessage = "No matching options.",
	error,
	id,
	label,
	onValueChange,
	options,
	placeholder = "Search options",
	value,
}: ComboboxProps) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;
	const listboxId = `${fieldId}-listbox`;
	const descriptionId = description ? `${fieldId}-description` : undefined;
	const errorId = error ? `${fieldId}-error` : undefined;
	const inputRef = useRef<HTMLInputElement>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [query, setQuery] = useState("");
	const [hasSearchInput, setHasSearchInput] = useState(false);
	const { anchorName, handlePopoverToggle, open, popoverRef, setOpen } =
		useAnchoredPopover();
	const selectedLabel = getOptionLabel(options, value) ?? "";
	const inputValue = open && hasSearchInput ? query : selectedLabel;
	const filteredOptions = useMemo(
		() =>
			options.filter((option) =>
				matchesSearch(option, hasSearchInput ? query : ""),
			),
		[hasSearchInput, options, query],
	);

	function openList(nextQuery = "") {
		if (disabled) {
			return;
		}

		setQuery(nextQuery);
		setHasSearchInput(false);
		setActiveIndex(
			getInitialActiveIndex(
				options.filter((option) => matchesSearch(option, nextQuery)),
				value,
			),
		);
		setOpen(true);
		requestAnimationFrame(() => inputRef.current?.select());
	}

	function closeList() {
		setOpen(false);
		setQuery("");
		setHasSearchInput(false);
		inputRef.current?.focus();
	}

	function selectOption(index: number | null) {
		if (index === null) {
			return;
		}

		const option = filteredOptions[index];

		if (!option || option.disabled) {
			return;
		}

		onValueChange(option.value);
		closeList();
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const nextQuery = event.target.value;

		setQuery(nextQuery);
		setHasSearchInput(true);
		setActiveIndex(
			getInitialActiveIndex(
				options.filter((option) => matchesSearch(option, nextQuery)),
				value,
			),
		);
		setOpen(true);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (
			open &&
			!hasSearchInput &&
			event.key.length === 1 &&
			!event.metaKey &&
			!event.ctrlKey &&
			!event.altKey
		) {
			event.preventDefault();
			setHasSearchInput(true);
			setQuery(event.key);
			setActiveIndex(
				getInitialActiveIndex(
					options.filter((option) => matchesSearch(option, event.key)),
					value,
				),
			);
			return;
		}

		if (!open && ["ArrowDown", "ArrowUp"].includes(event.key)) {
			event.preventDefault();
			openList("");
			return;
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex(getNextActiveIndex(filteredOptions, activeIndex, 1));
			return;
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex(getNextActiveIndex(filteredOptions, activeIndex, -1));
			return;
		}

		if (event.key === "Home") {
			event.preventDefault();
			setActiveIndex(getBoundaryActiveIndex(filteredOptions, "first"));
			return;
		}

		if (event.key === "End") {
			event.preventDefault();
			setActiveIndex(getBoundaryActiveIndex(filteredOptions, "last"));
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();
			selectOption(activeIndex);
			return;
		}

		if (event.key === "Escape") {
			event.preventDefault();
			closeList();
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
			<input
				aria-activedescendant={getActiveDescendantId(fieldId, activeIndex)}
				aria-autocomplete="list"
				aria-controls={listboxId}
				aria-describedby={getDescribedBy(descriptionId, errorId)}
				aria-expanded={open}
				aria-invalid={Boolean(error) || undefined}
				aria-labelledby={`${fieldId}-label`}
				className={cn(dropdownControlClassName, "pr-10")}
				disabled={disabled}
				id={fieldId}
				onChange={handleInputChange}
				onClick={() => !open && openList("")}
				onFocus={() => requestAnimationFrame(() => inputRef.current?.select())}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				role="combobox"
				style={getAnchorStyle(anchorName)}
				value={inputValue}
			/>

			<div
				className="dropdown-popover z-50 mt-1"
				onToggle={handlePopoverToggle}
				popover="auto"
				ref={popoverRef}
				style={getAnchorStyle(anchorName)}
			>
				<div
					aria-labelledby={`${fieldId}-label`}
					className={dropdownPanelClassName}
					id={listboxId}
					role="listbox"
				>
					{filteredOptions.length === 0 ? (
						<p className="m-0 px-4 py-3 text-dim text-sm">{emptyMessage}</p>
					) : (
						filteredOptions.map((option, index) => (
							<button
								aria-disabled={option.disabled || undefined}
								aria-selected={option.value === value}
								className={cn(
									optionBaseClassName,
									"border-b last:border-b-0",
									option.value === value && "text-accent",
								)}
								data-active={activeIndex === index}
								data-disabled={option.disabled || undefined}
								disabled={option.disabled}
								id={`${fieldId}-option-${index}`}
								key={option.value}
								onClick={() => selectOption(index)}
								onMouseEnter={() => !option.disabled && setActiveIndex(index)}
								onMouseDown={(event) => event.preventDefault()}
								role="option"
								type="button"
							>
								<span className="grid grid-cols-[1rem_1fr] gap-3">
									<span aria-hidden="true" className="font-oz-mono text-accent">
										{option.value === value ? "✓" : ""}
									</span>
									<span className="grid gap-1">
										{renderOptionContent(option)}
									</span>
								</span>
							</button>
						))
					)}
				</div>
			</div>
		</DropdownFieldShell>
	);
}

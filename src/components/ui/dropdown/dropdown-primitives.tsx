import type { KeyboardEvent, RefObject } from "react";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/cn";
import type { DropdownAnchorStyle, DropdownOption } from "./types";

export const dropdownControlClassName =
	"dropdown-anchor flex min-h-13 w-full items-center justify-between gap-3 border border-border-strong bg-background px-4 py-[0.85rem] text-left font-oz-sans text-base leading-6 text-foreground transition-[background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-dim aria-invalid:border-accent-strong aria-invalid:ring-1 aria-invalid:ring-accent-strong";

export const dropdownPanelClassName =
	"dropdown-panel border border-border-strong bg-surface font-oz-sans text-foreground";

export const optionBaseClassName =
	"grid w-full cursor-pointer gap-1 border-border px-4 py-3 text-left transition-colors duration-150 ease-out data-[active=true]:bg-surface-raised data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45";

export function getOptionLabel(
	options: DropdownOption[],
	value: string | null,
) {
	return options.find((option) => option.value === value)?.label;
}

export function getDescribedBy(...ids: Array<string | undefined>) {
	const describedBy = ids.filter(Boolean).join(" ");

	return describedBy || undefined;
}

export function getAnchorStyle(anchorName: string): DropdownAnchorStyle {
	return { "--dropdown-anchor-name": anchorName };
}

export function getActiveDescendantId(
	baseId: string,
	activeIndex: number | null,
) {
	return activeIndex === null ? undefined : `${baseId}-option-${activeIndex}`;
}

export function getInitialActiveIndex(
	options: DropdownOption[],
	value?: string | null,
) {
	const selectedIndex = options.findIndex(
		(option) => option.value === value && !option.disabled,
	);

	if (selectedIndex >= 0) {
		return selectedIndex;
	}

	return options.findIndex((option) => !option.disabled);
}

export function getNextActiveIndex(
	options: DropdownOption[],
	activeIndex: number | null,
	direction: 1 | -1,
) {
	if (options.length === 0) {
		return null;
	}

	const startIndex = activeIndex ?? (direction === 1 ? -1 : options.length);

	for (let step = 1; step <= options.length; step += 1) {
		const index =
			(startIndex + direction * step + options.length) % options.length;

		if (!options[index]?.disabled) {
			return index;
		}
	}

	return activeIndex;
}

export function getBoundaryActiveIndex(
	options: DropdownOption[],
	boundary: "first" | "last",
) {
	const candidates = boundary === "first" ? options : [...options].reverse();
	const option = candidates.find((candidate) => !candidate.disabled);

	return option ? options.indexOf(option) : null;
}

export function matchesSearch(option: DropdownOption, query: string) {
	const normalizedQuery = query.trim().toLocaleLowerCase();

	if (!normalizedQuery) {
		return true;
	}

	return [option.label, option.description, option.kicker]
		.filter(Boolean)
		.join(" ")
		.toLocaleLowerCase()
		.includes(normalizedQuery);
}

export function useAnchoredPopover() {
	const id = useId();
	const popoverRef = useRef<HTMLDivElement>(null);
	const [open, setOpenState] = useState(false);
	const anchorName = useMemo(
		() => `--oz-dropdown-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`,
		[id],
	);

	const setOpen = useCallback((nextOpen: boolean) => {
		const popover = popoverRef.current;

		if (!popover) {
			setOpenState(nextOpen);
			return;
		}

		const isActuallyOpen = popover.matches(":popover-open");

		if (nextOpen === isActuallyOpen) {
			setOpenState(nextOpen);
			return;
		}

		if (nextOpen) {
			popover.showPopover();
		} else {
			popover.hidePopover();
		}
	}, []);

	useEffect(() => {
		const popover = popoverRef.current;

		if (!popover) {
			return;
		}

		function handleToggle() {
			setOpenState(popover?.matches(":popover-open") ?? false);
		}

		popover.addEventListener("toggle", handleToggle);

		return () => popover.removeEventListener("toggle", handleToggle);
	}, []);

	return { anchorName, open, popoverRef, setOpen };
}

export function focusElement<T extends HTMLElement>(ref: RefObject<T | null>) {
	requestAnimationFrame(() => ref.current?.focus());
}

export function renderOptionContent(option: DropdownOption) {
	return (
		<>
			{option.kicker ? (
				<span className="font-oz-mono text-[0.68rem] text-accent uppercase tracking-[0.14em]">
					{option.kicker}
				</span>
			) : null}
			<span className="font-medium leading-5">{option.label}</span>
			{option.description ? (
				<span className="text-muted text-sm leading-5">
					{option.description}
				</span>
			) : null}
		</>
	);
}

export function handleListNavigation({
	activeIndex,
	close,
	event,
	onSelectActive,
	options,
	setActiveIndex,
}: {
	activeIndex: number | null;
	close: () => void;
	event: KeyboardEvent;
	onSelectActive: () => void;
	options: DropdownOption[];
	setActiveIndex: (index: number | null) => void;
}) {
	if (event.key === "ArrowDown") {
		event.preventDefault();
		setActiveIndex(getNextActiveIndex(options, activeIndex, 1));
		return;
	}

	if (event.key === "ArrowUp") {
		event.preventDefault();
		setActiveIndex(getNextActiveIndex(options, activeIndex, -1));
		return;
	}

	if (event.key === "Home") {
		event.preventDefault();
		setActiveIndex(getBoundaryActiveIndex(options, "first"));
		return;
	}

	if (event.key === "End") {
		event.preventDefault();
		setActiveIndex(getBoundaryActiveIndex(options, "last"));
		return;
	}

	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		onSelectActive();
		return;
	}

	if (event.key === "Escape") {
		event.preventDefault();
		close();
	}
}

export function DropdownCaret({ open }: { open: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"font-oz-mono text-accent transition-transform duration-150 ease-out",
				open && "rotate-180",
			)}
		>
			▾
		</span>
	);
}

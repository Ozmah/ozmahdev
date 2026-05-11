import type { CSSProperties } from "react";

export interface DropdownOption {
	description?: string;
	disabled?: boolean;
	kicker?: string;
	label: string;
	value: string;
}

export interface DropdownFieldProps {
	description?: string;
	disabled?: boolean;
	error?: string;
	id?: string;
	label: string;
}

export type DropdownAnchorStyle = CSSProperties & {
	"--dropdown-anchor-name": string;
};

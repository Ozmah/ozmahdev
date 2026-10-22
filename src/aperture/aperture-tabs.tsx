import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArtifactSurfaceSection } from "./sections/artifact-surface-section";
import { BackgroundLabSection } from "./sections/background-lab-section";
import { ButtonsSection } from "./sections/buttons-section";
import { DropdownsSection } from "./sections/dropdowns-section";
import { InputsSection } from "./sections/inputs-section";
import { OgImageSection } from "./sections/og-image-section";
import { PaletteSection } from "./sections/palette-section";
import { ReceiptSection } from "./sections/receipt-section";
import { SwitchesSection } from "./sections/switches-section";
import { TypographySection } from "./sections/typography-section";
import { WordmarkSection } from "./sections/wordmark-section";

const tabs = [
	{ id: "foundations", label: "Foundations" },
	{ id: "controls", label: "Controls" },
	{ id: "visual-labs", label: "Visual labs" },
	{ id: "generators", label: "Generators" },
] as const;

type ApertureTabId = (typeof tabs)[number]["id"];
type HistoryMode = "push" | "replace";

const DEFAULT_TAB: ApertureTabId = "foundations";

export function ApertureTabs() {
	const [activeTab, setActiveTab] = useState<ApertureTabId>(DEFAULT_TAB);
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

	useEffect(() => {
		function syncTabFromUrl() {
			setActiveTab(getTabFromUrl());
		}

		syncTabFromUrl();
		window.addEventListener("popstate", syncTabFromUrl);

		return () => {
			window.removeEventListener("popstate", syncTabFromUrl);
		};
	}, []);

	function activateTab(tabId: ApertureTabId, historyMode: HistoryMode) {
		if (tabId === activeTab) {
			scrollPanelIntoView(tabId);
			return;
		}

		setActiveTab(tabId);
		writeTabToUrl(tabId, historyMode);
		scrollPanelIntoView(tabId);
	}

	function handleTabKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		currentIndex: number,
	) {
		const nextIndex = getNextTabIndex(event.key, currentIndex);

		if (nextIndex === null) {
			return;
		}

		event.preventDefault();
		const nextTab = tabs[nextIndex];
		activateTab(nextTab.id, "replace");
		tabRefs.current[nextIndex]?.focus();
	}

	return (
		<>
			<div className="sticky top-0 z-20 -mx-5 bg-background px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
				<div className="overflow-x-auto border-border-strong border-b">
					<div
						aria-label="Aperture sections"
						aria-orientation="horizontal"
						className="flex min-w-max"
						role="tablist"
					>
						{tabs.map((tab, index) => {
							const isActive = tab.id === activeTab;

							return (
								<button
									aria-controls={`${tab.id}-panel`}
									aria-selected={isActive}
									className={`min-h-12 shrink-0 border-b-2 px-4 font-oz-mono text-sm uppercase tracking-wider ${
										isActive
											? "border-accent bg-surface text-accent"
											: "border-transparent text-dim hover:bg-surface hover:text-foreground"
									}`}
									id={`${tab.id}-tab`}
									key={tab.id}
									onClick={() => activateTab(tab.id, "push")}
									onKeyDown={(event) => handleTabKeyDown(event, index)}
									ref={(element) => {
										tabRefs.current[index] = element;
									}}
									role="tab"
									tabIndex={isActive ? 0 : -1}
									type="button"
								>
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{tabs.map((tab) => {
				const isActive = tab.id === activeTab;

				return (
					<div
						aria-labelledby={`${tab.id}-tab`}
						className="scroll-mt-12"
						hidden={!isActive}
						id={`${tab.id}-panel`}
						key={tab.id}
						role="tabpanel"
					>
						{isActive ? <TabContent tabId={tab.id} /> : null}
					</div>
				);
			})}
		</>
	);
}

function TabContent({ tabId }: { tabId: ApertureTabId }) {
	switch (tabId) {
		case "foundations":
			return (
				<>
					<PaletteSection />
					<WordmarkSection />
					<TypographySection />
				</>
			);
		case "controls":
			return (
				<>
					<ButtonsSection />
					<DropdownsSection />
					<SwitchesSection />
					<InputsSection />
				</>
			);
		case "visual-labs":
			return (
				<>
					<ArtifactSurfaceSection />
					<BackgroundLabSection />
				</>
			);
		case "generators":
			return (
				<>
					<ReceiptSection />
					<OgImageSection />
				</>
			);
	}
}

function getTabFromUrl(): ApertureTabId {
	const tab = new URL(window.location.href).searchParams.get("tab");
	return isApertureTabId(tab) ? tab : DEFAULT_TAB;
}

function writeTabToUrl(tabId: ApertureTabId, historyMode: HistoryMode) {
	const url = new URL(window.location.href);
	url.searchParams.set("tab", tabId);
	url.hash = "";

	if (historyMode === "push") {
		window.history.pushState(window.history.state, "", url);
		return;
	}

	window.history.replaceState(window.history.state, "", url);
}

function scrollPanelIntoView(tabId: ApertureTabId) {
	requestAnimationFrame(() => {
		document
			.getElementById(`${tabId}-panel`)
			?.scrollIntoView({ block: "start" });
	});
}

function getNextTabIndex(key: string, currentIndex: number) {
	switch (key) {
		case "ArrowLeft":
			return (currentIndex - 1 + tabs.length) % tabs.length;
		case "ArrowRight":
			return (currentIndex + 1) % tabs.length;
		case "Home":
			return 0;
		case "End":
			return tabs.length - 1;
		default:
			return null;
	}
}

function isApertureTabId(value: string | null): value is ApertureTabId {
	return tabs.some((tab) => tab.id === value);
}

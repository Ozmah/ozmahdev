import { afterEach, describe, expect, test } from "vitest";
import {
	captureAnalyticsEvent,
	disableAnalytics,
	enableAnalytics,
	isPrivacySignalEnabled,
	readAnalyticsAcquisitionProperties,
	readAnalyticsPathname,
	readAnalyticsRoute,
	registerAnalyticsClient,
	sanitizeAnalyticsProperties,
	setAnalyticsAcquisitionContext,
	stripAnalyticsUrlDetails,
} from "./analytics";

afterEach(disableAnalytics);

describe("analytics privacy helpers", () => {
	test("classifies routes using pathname only", () => {
		expect(readAnalyticsRoute("/")).toBe("home");
		expect(readAnalyticsRoute("/work")).toBe("work");
		expect(readAnalyticsRoute("/unknown")).toBe("other");
		expect(readAnalyticsPathname("/private@example.com/reset/token")).toBe(
			"/404",
		);
	});

	test("removes query strings and fragments from URLs", () => {
		expect(
			stripAnalyticsUrlDetails(
				"https://ozmah.dev/work?token=secret#project",
				"https://ozmah.dev",
			),
		).toBe("https://ozmah.dev/work");
	});

	test("sanitizes nested Web Vitals URL properties", () => {
		expect(
			sanitizeAnalyticsProperties(
				{
					$web_vitals_LCP_event: {
						entries: [
							{ name: "https://ozmah.dev/image.webp?signature=secret" },
						],
						navigationURL: "https://ozmah.dev/work?private=true#card",
					},
					label: "leave?ordinary#text-alone",
				},
				"https://ozmah.dev",
			),
		).toEqual({
			$web_vitals_LCP_event: {
				entries: [{ name: "https://ozmah.dev/image.webp" }],
				navigationURL: "https://ozmah.dev/work",
			},
			label: "leave?ordinary#text-alone",
		});
	});

	test("recognizes GPC and current or legacy DNT signals", () => {
		expect(isPrivacySignalEnabled(true)).toBe(true);
		expect(isPrivacySignalEnabled("1")).toBe(true);
		expect(isPrivacySignalEnabled(undefined, "YES")).toBe(true);
		expect(isPrivacySignalEnabled(false, "0", undefined)).toBe(false);
	});

	test("allows safe campaign values and only the referring domain", () => {
		expect(
			readAnalyticsAcquisitionProperties(
				"https://ozmah.dev/work?utm_source=github&utm_medium=referral&utm_campaign=profile&utm_content=private&gclid=secret",
				"https://www.google.com/search?q=private",
			),
		).toEqual({
			$referring_domain: "google.com",
			utm_medium: "referral",
			utm_source: "github",
		});
	});

	test("treats same-site subdomains as direct navigation", () => {
		expect(
			readAnalyticsAcquisitionProperties(
				"https://ozmah.dev/",
				"https://www.ozmah.dev/work",
			),
		).toEqual({ $referring_domain: "$direct" });
	});

	test("reduces referrers to a registrable domain approximation", () => {
		expect(
			readAnalyticsAcquisitionProperties(
				"https://ozmah.dev/",
				"https://private-customer.docs.example.co.uk/path?secret=true",
			),
		).toEqual({ $referring_domain: "example.co.uk" });
	});

	test("rejects unsafe campaign values and internal referrers", () => {
		expect(
			readAnalyticsAcquisitionProperties(
				"https://ozmah.dev/?utm_source=user@example.com&utm_campaign=%3Cprivate%3E",
				"https://ozmah.dev/work?private=true",
			),
		).toEqual({ $referring_domain: "$direct" });
	});
});

describe("analytics event queue", () => {
	test("flushes early typed events after the client loads", () => {
		const captured: Array<{ eventName: string; properties: unknown }> = [];

		setAnalyticsAcquisitionContext({
			$referring_domain: "github.com",
			utm_medium: "referral",
			utm_source: "github",
		});
		enableAnalytics();
		captureAnalyticsEvent("contact_started", {
			channel: "email",
			placement: "contact_page",
		});
		registerAnalyticsClient({
			capture: (eventName, properties) => {
				captured.push({ eventName, properties });
			},
		});

		expect(captured).toEqual([
			{
				eventName: "contact_started",
				properties: {
					$referring_domain: "github.com",
					channel: "email",
					placement: "contact_page",
					utm_medium: "referral",
					utm_source: "github",
				},
			},
		]);
	});
});

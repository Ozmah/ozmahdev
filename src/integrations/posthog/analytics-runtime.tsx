import { useRouterState } from "@tanstack/react-router";
import type {
	BeforeSendFn,
	PostHogConfig,
} from "posthog-js/dist/module.slim.no-external";
import { useEffect, useRef } from "react";
import type { Metric } from "web-vitals";
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
} from "./analytics";

const EXPECTED_POSTHOG_HOST = "https://us.i.posthog.com";
const configuredPostHogHost =
	import.meta.env.VITE_POSTHOG_HOST?.trim() || EXPECTED_POSTHOG_HOST;
const postHogHostIsValid = configuredPostHogHost === EXPECTED_POSTHOG_HOST;
const CAPTURED_WEB_VITALS = new Set<Metric["name"]>([
	"CLS",
	"FCP",
	"INP",
	"LCP",
]);
const postHogKey = import.meta.env.VITE_POSTHOG_KEY?.trim();
let analyticsCaptureAllowed = false;
let initialAnalyticsPathname = "/";
let webVitalsStarted = false;
let initializedPostHog:
	| Parameters<typeof registerAnalyticsClient>[0]
	| undefined;

const sanitizeEvent: BeforeSendFn = (event) => {
	if (!event || !analyticsCaptureAllowed || browserRequestsPrivacy()) {
		return null;
	}

	try {
		const properties = sanitizeAnalyticsProperties(
			event.properties,
			window.location.origin,
		);
		const eventPathname =
			typeof properties.$pathname === "string"
				? properties.$pathname
				: window.location.pathname;
		const pathname = readAnalyticsPathname(eventPathname);
		properties.$current_url = `${window.location.origin}${pathname}`;
		properties.$pathname = pathname;
		if ("$initial_current_url" in properties) {
			properties.$initial_current_url = `${window.location.origin}${initialAnalyticsPathname}`;
		}
		if ("$session_entry_url" in properties) {
			properties.$session_entry_url = `${window.location.origin}${initialAnalyticsPathname}`;
		}
		delete properties.$referrer;
		delete properties.$prev_pageview_pathname;

		return {
			...event,
			properties,
		};
	} catch {
		return null;
	}
};

const postHogOptions = {
	api_host: EXPECTED_POSTHOG_HOST,
	ui_host: "https://us.posthog.com",
	defaults: "2026-08-29",
	debug: false,
	persistence: "memory",
	disable_persistence: true,
	person_profiles: "never",
	autocapture: false,
	capture_pageview: false,
	capture_pageleave: true,
	disable_scroll_properties: false,
	disable_capture_url_hashes: true,
	capture_exceptions: false,
	// Captured locally with web-vitals to avoid loading PostHog's full extension bundle.
	capture_performance: false,
	capture_heatmaps: false,
	capture_dead_clicks: false,
	rageclick: false,
	disable_session_recording: true,
	enable_recording_console_log: false,
	disable_surveys: true,
	disable_surveys_automatic_display: true,
	disable_product_tours: true,
	disable_conversations: true,
	disable_web_experiments: true,
	disable_external_dependency_loading: true,
	advanced_disable_flags: true,
	respect_dnt: true,
	disableDeviceModel: true,
	mask_all_text: true,
	mask_all_element_attributes: true,
	mask_personal_data_properties: true,
	properties_string_max_length: 512,
	property_denylist: [
		"$browser_version",
		"$device_model",
		"$gclid",
		"$dclid",
		"$fbclid",
		"$li_fat_id",
		"$msclkid",
		"$os_version",
		"$prev_pageview_pathname",
		"$raw_user_agent",
		"$screen_height",
		"$screen_width",
		"$timezone",
		"$timezone_offset",
		"$ttclid",
		"$twclid",
		"$viewport_height",
		"$viewport_width",
	],
	// Acquisition is captured through a strict allowlist before the SDK loads.
	save_campaign_params: false,
	save_referrer: false,
} satisfies Partial<PostHogConfig>;

export function AnalyticsRuntime() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const previousPathnameRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (
			import.meta.env.SSR ||
			!import.meta.env.PROD ||
			!postHogKey ||
			!postHogHostIsValid ||
			browserRequestsPrivacy()
		) {
			return;
		}

		let cancelled = false;
		analyticsCaptureAllowed = true;
		initialAnalyticsPathname = readAnalyticsPathname(window.location.pathname);
		setAnalyticsAcquisitionContext(
			readAnalyticsAcquisitionProperties(
				window.location.href,
				document.referrer,
			),
		);
		enableAnalytics();

		if (initializedPostHog) {
			registerAnalyticsClient(initializedPostHog);
			return disableAnalyticsCapture;
		}

		void Promise.all([
			import("posthog-js/dist/module.slim.no-external"),
			import("web-vitals"),
		])
			.then(([{ default: postHog }, webVitals]) => {
				if (cancelled || browserRequestsPrivacy()) {
					disableAnalyticsCapture();
					return;
				}

				postHog.init(postHogKey, {
					...postHogOptions,
					before_send: sanitizeEvent,
					loaded: (client) => {
						initializedPostHog = client;
						registerAnalyticsClient(client);
						startWebVitals(webVitals);
					},
				});
			})
			.catch(() => {
				if (!cancelled) {
					disableAnalyticsCapture();
				}
			});

		return () => {
			cancelled = true;
			disableAnalyticsCapture();
		};
	}, []);

	useEffect(() => {
		if (
			import.meta.env.SSR ||
			!import.meta.env.PROD ||
			!postHogKey ||
			!postHogHostIsValid
		) {
			return;
		}

		if (pathname === previousPathnameRef.current) {
			return;
		}

		previousPathnameRef.current = pathname;
		const analyticsPathname = readAnalyticsPathname(pathname);
		captureAnalyticsEvent("$pageview", {
			$current_url: `${window.location.origin}${analyticsPathname}`,
			$pathname: analyticsPathname,
			environment: "production",
			route: readAnalyticsRoute(pathname),
		});
	}, [pathname]);

	return null;
}

function disableAnalyticsCapture() {
	analyticsCaptureAllowed = false;
	disableAnalytics();
}

function browserRequestsPrivacy() {
	const privacyNavigator = navigator as Navigator & {
		globalPrivacyControl?: boolean;
		msDoNotTrack?: string;
	};
	const legacyWindow = window as Window & { doNotTrack?: string };

	return isPrivacySignalEnabled(
		privacyNavigator.globalPrivacyControl,
		navigator.doNotTrack,
		privacyNavigator.msDoNotTrack,
		legacyWindow.doNotTrack,
	);
}

function startWebVitals(webVitals: typeof import("web-vitals")) {
	if (webVitalsStarted) {
		return;
	}

	webVitalsStarted = true;
	const metrics = new Map<"CLS" | "FCP" | "INP" | "LCP", Metric>();
	let flushTimer: number | undefined;

	const flush = () => {
		window.clearTimeout(flushTimer);
		flushTimer = undefined;

		if (metrics.size === 0) {
			return;
		}

		const pathname = readAnalyticsPathname(window.location.pathname);
		const properties: Parameters<
			typeof captureAnalyticsEvent<"$web_vitals">
		>[1] = {
			$current_url: `${window.location.origin}${pathname}`,
		};

		for (const [name, metric] of metrics) {
			properties[`$web_vitals_${name}_value`] = metric.value;
			properties[`$web_vitals_${name}_event`] = {
				delta: metric.delta,
				id: metric.id,
				name,
				navigationType: metric.navigationType,
				rating: metric.rating,
				value: metric.value,
			};
		}

		metrics.clear();
		captureAnalyticsEvent("$web_vitals", properties);
	};

	const collect = (metric: Metric) => {
		if (!CAPTURED_WEB_VITALS.has(metric.name) || metric.name === "TTFB") {
			return;
		}

		metrics.set(metric.name, metric);

		if (metrics.size === 4) {
			flush();
			return;
		}

		flushTimer ??= window.setTimeout(flush, 5000);
	};

	webVitals.onCLS(collect);
	webVitals.onFCP(collect);
	webVitals.onINP(collect);
	webVitals.onLCP(collect);
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			window.setTimeout(flush, 0);
		}
	});
	window.addEventListener("pagehide", () => window.setTimeout(flush, 0));
}

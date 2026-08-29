export type AnalyticsAcquisitionProperties = {
	$referring_domain: string;
	utm_campaign?: string;
	utm_medium?: string;
	utm_source?: string;
};

export type ContactChannel =
	| "discord"
	| "email"
	| "github"
	| "linkedin"
	| "twitter";

export type OutboundDestination = "live_site";

type WebVitalName = "CLS" | "FCP" | "INP" | "LCP";
type WebVitalMetric = {
	delta: number;
	id: string;
	name: WebVitalName;
	navigationType: string;
	rating: string;
	value: number;
};
type WebVitalsEventProperties = {
	$current_url: string;
} & Partial<Record<`$web_vitals_${WebVitalName}_value`, number>> &
	Partial<Record<`$web_vitals_${WebVitalName}_event`, WebVitalMetric>>;

type AnalyticsRoute =
	| "aperture"
	| "contact"
	| "home"
	| "other"
	| "privacy"
	| "work";

type AnalyticsEventProperties = {
	$pageview: {
		$current_url: string;
		$pathname: string;
		environment: "production";
		route: AnalyticsRoute;
	};
	$web_vitals: WebVitalsEventProperties;
	contact_started: {
		channel: ContactChannel;
		placement: "contact_page";
	};
	outbound_link_clicked: {
		destination_type: OutboundDestination;
		placement: "work_grid";
		project_slug: string;
	};
};

type AnalyticsEventName = keyof AnalyticsEventProperties;
type EnrichedProperties<EventName extends AnalyticsEventName> =
	AnalyticsEventProperties[EventName] & Partial<AnalyticsAcquisitionProperties>;
type AnalyticsClient = {
	capture: (
		eventName: AnalyticsEventName,
		properties: EnrichedProperties<AnalyticsEventName>,
	) => unknown;
};
type PendingEvent = {
	[EventName in AnalyticsEventName]: {
		eventName: EventName;
		properties: EnrichedProperties<EventName>;
	};
}[AnalyticsEventName];

const ALLOWED_UTM_SOURCES = new Set([
	"bing",
	"discord",
	"github",
	"google",
	"linkedin",
	"newsletter",
	"twitter",
	"x",
	"youtube",
]);
const ALLOWED_UTM_MEDIA = new Set([
	"cpc",
	"email",
	"organic",
	"paid_social",
	"ppc",
	"referral",
	"social",
]);
// Add only public, predetermined campaign slugs. Never accept arbitrary values.
const ALLOWED_UTM_CAMPAIGNS = new Set<string>();
const COMMON_SECOND_LEVEL_SUFFIXES = new Set([
	"co.jp",
	"co.nz",
	"co.uk",
	"com.au",
	"com.br",
	"com.mx",
]);
const MAX_PENDING_EVENTS = 25;
const ROUTE_BY_PATHNAME = {
	"/": "home",
	"/aperture": "aperture",
	"/contact": "contact",
	"/privacy": "privacy",
	"/work": "work",
} as const;
const URL_PROPERTY_NAMES = new Set([
	"$current_url",
	"$initial_current_url",
	"$referrer",
	"$session_entry_url",
	"filename",
	"href",
	"name",
	"navigationURL",
	"scriptURL",
	"sourceURL",
	"url",
]);
const pendingEvents: PendingEvent[] = [];
let acquisitionContext: AnalyticsAcquisitionProperties | undefined;
let analyticsClient: AnalyticsClient | undefined;
let analyticsEnabled = false;

export function captureAnalyticsEvent<EventName extends AnalyticsEventName>(
	eventName: EventName,
	properties: AnalyticsEventProperties[EventName],
) {
	if (!analyticsEnabled) {
		return;
	}

	const enrichedProperties = { ...properties, ...acquisitionContext };

	if (analyticsClient) {
		analyticsClient.capture(eventName, enrichedProperties);
		return;
	}

	if (pendingEvents.length === MAX_PENDING_EVENTS) {
		pendingEvents.shift();
	}

	pendingEvents.push({
		eventName,
		properties: enrichedProperties,
	} as PendingEvent);
}

export function enableAnalytics() {
	analyticsEnabled = true;
}

export function disableAnalytics() {
	analyticsEnabled = false;
	analyticsClient = undefined;
	acquisitionContext = undefined;
	pendingEvents.length = 0;
}

export function registerAnalyticsClient(client: AnalyticsClient) {
	analyticsClient = client;

	for (const event of pendingEvents.splice(0)) {
		client.capture(event.eventName, event.properties);
	}
}

export function setAnalyticsAcquisitionContext(
	properties: AnalyticsAcquisitionProperties,
) {
	acquisitionContext = properties;
}

export function isPrivacySignalEnabled(...values: unknown[]) {
	return values.some(
		(value) =>
			value === true ||
			(typeof value === "string" &&
				(value.toLowerCase() === "1" || value.toLowerCase() === "yes")),
	);
}

export function readAnalyticsAcquisitionProperties(
	currentUrl: string,
	referrer: string,
): AnalyticsAcquisitionProperties {
	const properties: AnalyticsAcquisitionProperties = {
		$referring_domain: readReferringDomain(currentUrl, referrer),
	};

	try {
		const searchParams = new URL(currentUrl).searchParams;
		const source = searchParams.get("utm_source")?.trim().toLowerCase();
		const medium = searchParams.get("utm_medium")?.trim().toLowerCase();
		const campaign = searchParams.get("utm_campaign")?.trim().toLowerCase();

		if (source && ALLOWED_UTM_SOURCES.has(source)) {
			properties.utm_source = source;
		}
		if (medium && ALLOWED_UTM_MEDIA.has(medium)) {
			properties.utm_medium = medium;
		}
		if (campaign && ALLOWED_UTM_CAMPAIGNS.has(campaign)) {
			properties.utm_campaign = campaign;
		}
	} catch {
		// Invalid URLs contribute no acquisition data.
	}

	return properties;
}

export function readAnalyticsRoute(pathname: string): AnalyticsRoute {
	return (
		ROUTE_BY_PATHNAME[pathname as keyof typeof ROUTE_BY_PATHNAME] ?? "other"
	);
}

export function readAnalyticsPathname(pathname: string) {
	return readAnalyticsRoute(pathname) === "other" ? "/404" : pathname;
}

export function stripAnalyticsUrlDetails(value: string, origin: string) {
	try {
		const url = new URL(value, origin);
		return `${url.origin}${url.pathname}`;
	} catch {
		return value.split(/[?#]/, 1)[0] ?? value;
	}
}

export function sanitizeAnalyticsProperties(
	properties: Record<string, unknown>,
	origin: string,
) {
	return sanitizeNestedValue(properties, origin) as Record<string, unknown>;
}

function sanitizeNestedValue(
	value: unknown,
	origin: string,
	propertyName?: string,
): unknown {
	if (typeof value === "string") {
		return propertyName &&
			URL_PROPERTY_NAMES.has(propertyName) &&
			/[?#]/.test(value)
			? stripAnalyticsUrlDetails(value, origin)
			: value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeNestedValue(item, origin));
	}

	if (!value || typeof value !== "object") {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value).map(([key, nestedValue]) => [
			key,
			sanitizeNestedValue(nestedValue, origin, key),
		]),
	);
}

function readReferringDomain(currentUrl: string, referrer: string) {
	if (!referrer) {
		return "$direct";
	}

	try {
		const current = new URL(currentUrl);
		const referring = new URL(referrer);

		if (
			(referring.protocol !== "http:" && referring.protocol !== "https:") ||
			referring.origin === current.origin ||
			reduceReferringDomain(referring.hostname) ===
				reduceReferringDomain(current.hostname)
		) {
			return "$direct";
		}

		return reduceReferringDomain(referring.hostname);
	} catch {
		return "$direct";
	}
}

function reduceReferringDomain(hostname: string) {
	const labels = hostname
		.toLowerCase()
		.replace(/^www\./, "")
		.split(".");

	if (labels.length <= 2) {
		return labels.join(".");
	}

	const suffix = labels.slice(-2).join(".");

	return labels
		.slice(COMMON_SECOND_LEVEL_SUFFIXES.has(suffix) ? -3 : -2)
		.join(".");
}

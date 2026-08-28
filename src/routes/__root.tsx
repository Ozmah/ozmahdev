import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { AppShell } from "../shell/app-shell";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: "#181B26",
			},
			{
				name: "color-scheme",
				content: "dark",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function NotFoundPage() {
	return (
		<>
			<title>Not Found | OzmahDev</title>
			<meta content="noindex, nofollow" name="robots" />
			<div className="flex flex-1 items-center justify-center px-4 py-24">
				<div className="max-w-md text-center">
					<p className="font-medium text-muted-foreground text-sm">404</p>
					<h1 className="mt-3 font-semibold text-3xl tracking-tight">
						Not here
					</h1>
					<p className="mt-4 text-muted-foreground leading-7">
						The page you're looking for is in another web.
					</p>
					<Link
						to="/"
						className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground text-sm no-underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
					>
						Home
					</Link>
				</div>
			</div>
		</>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<a className="oz-skip-link" href="#main-content">
					Skip to content
				</a>
				<AppShell>{children}</AppShell>
				<TanStackDevtools
					config={{
						position: "bottom-right",
						inspectHotkey: ["Shift", "Alt", "CtrlOrMeta"],
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

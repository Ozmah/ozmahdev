/**
 * CV content. Rich text is modeled as segments instead of HTML strings so the
 * page never needs `set:html` (no XSS surface if this ever comes from a CMS).
 */
export type RichText = ReadonlyArray<string | { strong: string }>;

export interface CvJob {
	bullets: readonly RichText[];
	company: string;
	period: string;
	role: string;
	stack?: string;
	subtitle?: RichText;
}

export const cv = {
	name: "Gabriel Alejandro Alegría Robles",
	role: "Senior Full Stack Engineer",
	location: "Guadalajara / Zapopan, Jalisco, MX",
	links: [
		{ href: "https://ozmah.dev", label: "ozmah.dev" },
		{ href: "https://github.com/Ozmah", label: "github.com/Ozmah" },
		{
			href: "https://www.linkedin.com/in/gabriel-alegria-mx",
			label: "linkedin.com/in/gabriel-alegria-mx",
		},
	],
	summary: [
		"I'm a software engineer with 20+ years building everything from banking applications, e-commerce and CMSs to small personal software. For several years my stack has been PHP/Laravel and the backend domain, but nowadays it has expanded to TypeScript/Node, Docker, Redis and Kubernetes, to name a few. I enjoy working on products I'm proud to recommend.",
		"Today my workflows involve AI end-to-end: coding, research, automation, PoC/architecture experimentation, model benchmarks and testing, as well as experimenting with agent capabilities and limits.",
	],
	skills: [
		{
			label: "AI & Development",
			value:
				"Coding agents, AI harnesses, agent tooling & integrations, workflow automation, architecture experimentation",
		},
		{
			label: "Languages & Frameworks",
			value:
				"TypeScript, JavaScript, PHP, React, TanStack Start, Node.js, Bun, Laravel, ElysiaJS",
		},
		{
			label: "Backend & APIs",
			value:
				"REST APIs, background workers, queues, asynchronous processing, third-party integrations",
		},
		{
			label: "Databases",
			value:
				"MySQL, SQLite, PostgreSQL, Turso, Drizzle ORM, database design, concurrency control",
		},
		{
			label: "Infra & Reliability",
			value:
				"Docker, GitHub Actions, Linux, production debugging, incident response, performance optimization",
		},
		{
			label: "Product Engineering",
			value:
				"End-to-end product development, rapid prototyping, technical decision making, developer tooling, production ownership",
		},
	],
	aiTooling: [
		[
			"Use orchestrators like soloterm or herdr for my daily development workflow across OpenCode, Pi and Claude Code, working with Anthropic, OpenAI and open-weight models.",
		],
		[
			"Build tools and extensions for coding agents, including ",
			{ strong: "pi-permissions" },
			", an open-source permission system for Pi, and a Claude Code extension currently going through compliance review at Internet Brands.",
		],
		[
			"Prototype interfaces with Doop using agents connected through MCP, experimenting with UI, UX and AX before bringing them into my projects.",
		],
		[
			"Run Hermes on my private server for agent automation, with deployment capabilities through Coolify and private infrastructure connected over Tailscale.",
		],
	],
	experience: [
		{
			company: "Internet Brands",
			role: "Senior Full Stack Developer",
			period: "Apr 2015 — Present",
			subtitle: [
				"Previously ",
				{ strong: "PHP Lead" },
				" · Guadalajara, MX (Remote)",
			],
			bullets: [
				[
					"Build and maintain an enterprise CMS used across Internet Brands properties, covering editorial workflows, article management, freelancer management and payments, with Angular and Laravel 13.",
				],
				[
					"Own internal tools end-to-end, from identifying problems and proposing solutions to architecture, development and delivery. Recently built two internal tools, including one to help QA engineers test applications.",
				],
				[
					"Participate in a client-facing rotation for critical production issues, investigating failures, reproducing bugs and working through incidents with customers.",
				],
				[
					"Diagnosed and rewrote a category-deletion operation affected by race conditions and redundant queries, ",
					{ strong: "reducing execution time from 30+ seconds to ~20ms" },
					".",
				],
				[
					"Resolved ",
					{ strong: "TOCTOU race conditions" },
					" and complex background-worker issues in production. As PHP Lead, maintained dozens of CodeIgniter sites, mentored developers and participated in hiring.",
				],
			],
		},
		{
			company: "Consultapp",
			role: "Co-founder & Engineer",
			period: "Dec 2025 — Present",
			subtitle: ["Production SaaS with paying customers"],
			bullets: [
				[
					"Co-founded and built a production SaaS for commercial record management, taking it ",
					{ strong: "from concept to paying customers in under three months" },
					".",
				],
				[
					"Designed the full stack: TanStack Start (React) front end, ElysiaJS backend, Effect, Drizzle ORM, and MySQL/Turso (SQLite), deployed on Railway.",
				],
				[
					"Built the backend job system on ",
					{ strong: "Effect-based workers (fibers)" },
					" instead of BullMQ/Redis, handling token billing and async workflows.",
				],
				[
					"Implemented production-grade backend foundations: a typed error platform, pessimistic locking for token billing, role-based access control, session revocation and self-built observability.",
				],
				[
					"Built a custom Discord bot exposing operational commands (e.g. /status) that pull live summaries from Consultapp's API; designed for further AI integration.",
				],
			],
		},
		{
			company: "Global Hitss",
			role: "Technical Lead / Senior PHP Developer",
			period: "Sep 2013 — Mar 2015",
			subtitle: ["Client: ", { strong: "Alcatel" }],
			bullets: [
				[
					"Led a team of 3 developers (1 senior, 2 mid-level) building a ",
					{ strong: "greenfield product management and distribution system" },
					" for Latin American markets, using Symfony 2 and Doctrine ORM.",
				],
				[
					"Took the system from initial architecture to production in under a year, owning delivery end to end.",
				],
				[
					"Drove technical decisions and managed high-pressure scenarios with demanding stakeholders, defending engineering tradeoffs.",
				],
			],
		},
		{
			company: "Softtek",
			role: "PHP Developer",
			period: "Jan 2011 — May 2013",
			stack: "PHP · Zend Framework · Oracle · MySQL · SOAP/XML web services",
			bullets: [
				[
					"Built and maintained workflows for high-security financial applications handling sensitive customer and investment data under strict access controls.",
				],
				[
					"Selected by the Product Owner to take over long-term maintenance of an internal onboarding platform for an international banking client, owning it solo for ~2 years.",
				],
				[
					"Executed multiple production deployments of internal tooling for an international branch, with zero tolerance for downtime in a regulated environment.",
				],
			],
		},
	] satisfies readonly CvJob[],
	education: [
		{
			degree: "Master's in Systems Engineering",
			detail: "focus on Information Networks",
			school: "Universidad del Valle de México (UVM)",
			period: "2007 — 2009",
		},
		{
			degree: "B.S. in Computer Systems Engineering",
			school: "Instituto Tecnológico de Tuxtla Gutiérrez (ITTG)",
			period: "2002 — 2006",
		},
	],
	languages: [
		{ name: "Spanish", level: "native" },
		{ name: "English", level: "professional working proficiency" },
	],
} as const;

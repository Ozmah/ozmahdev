interface WorkProjectProps {
	alt: string;
	comment: string;
	height: number;
	href?: string;
	linkLabel?: string;
	src: string;
	title: string;
	width: number;
}

export function WorkProject({
	alt,
	comment,
	height,
	href,
	linkLabel,
	src,
	title,
	width,
}: WorkProjectProps) {
	const project = (
		<>
			<img
				alt={alt}
				className="aspect-8/5 w-full border border-border-strong object-cover object-top"
				decoding="async"
				height={height}
				loading="lazy"
				src={src}
				width={width}
			/>
			<div className="grid gap-3 pt-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
				<h2 className="m-0 font-oz-display text-3xl text-foreground uppercase leading-none tracking-[-0.04em] group-hover:text-accent group-focus-visible:text-accent sm:text-4xl">
					{title}
					{href ? <span className="sr-only"> (opens in a new tab)</span> : null}
				</h2>
				{linkLabel ? (
					<p className="m-0 font-oz-mono text-[0.7rem] text-accent tracking-[0.08em]">
						{linkLabel}
					</p>
				) : null}
			</div>
		</>
	);

	return (
		<article className="border-border-strong border-t pt-5">
			{href ? (
				<a
					className="group block text-inherit no-underline focus-visible:outline-offset-4"
					href={href}
					rel="noopener noreferrer"
					target="_blank"
				>
					{project}
				</a>
			) : (
				project
			)}

			<p className="mt-4 mb-0 max-w-2xl text-muted leading-7">{comment}</p>
		</article>
	);
}

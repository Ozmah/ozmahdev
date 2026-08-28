interface WorkImageProps {
	alt: string;
	caption: string;
	height: number;
	loading?: "eager" | "lazy";
	src: string;
	width: number;
}

export function WorkImage({
	alt,
	caption,
	height,
	loading = "lazy",
	src,
	width,
}: WorkImageProps) {
	return (
		<figure className="m-0 border border-border-strong bg-background">
			<img
				alt={alt}
				className="block h-auto w-full"
				decoding="async"
				height={height}
				loading={loading}
				src={src}
				width={width}
			/>
			<figcaption className="border-border border-t px-4 py-3 font-oz-mono text-[0.7rem] text-dim uppercase tracking-[0.14em]">
				{caption}
			</figcaption>
		</figure>
	);
}

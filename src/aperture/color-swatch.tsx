interface ColorSwatchProps {
	className: string;
	hex: string;
	name: string;
}

export function ColorSwatch({ className, hex, name }: ColorSwatchProps) {
	return (
		<div
			className={`${className} flex min-h-25 md:min-h-40 flex-col justify-end p-4`}
		>
			<p className="font-oz-sans text-lg font-bold">{name}</p>
			<p className="font-oz-mono mt-1 max-w-48 text-sm leading-snug">{hex}</p>
		</div>
	);
}

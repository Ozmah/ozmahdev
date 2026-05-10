interface TypographySpecimenProps {
	className: string;
	label: string;
}

export function TypographySpecimen({
	className,
	label,
}: TypographySpecimenProps) {
	return (
		<div className="border-oz-line bg-oz-surface border p-5">
			<p className="font-oz-mono text-oz-lime mb-4 text-xs uppercase tracking-widest">
				{label}
			</p>
			<div className={className}>
				<p className="text-3xl leading-tight text-oz-white md:text-5xl">
					I build things.
				</p>
				<p className="text-oz-muted mt-4 max-w-[65ch] text-base leading-7">
					A personal site by a developer shipping software, building a homelab,
					and playing with code every day.
				</p>
				<p className="text-oz-lime mt-4 text-sm uppercase tracking-widest">
					Homelab Online · Tesseract Booting · UTC-6
				</p>
			</div>
		</div>
	);
}

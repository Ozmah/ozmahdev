import { motion, useReducedMotion } from "motion/react";

export function IdentityMark() {
	const shouldReduceMotion = useReducedMotion();
	const realPhotoHover = shouldReduceMotion ? {} : { x: 18, y: -1 };
	const animePhotoHover = shouldReduceMotion ? {} : { x: -10, y: 2 };

	return (
		<motion.figure
			aria-label="Gabriel Alegría"
			className="relative m-0 h-32 w-36 sm:h-36 sm:w-40 lg:ml-10 lg:h-40 lg:w-44"
			initial="rest"
			whileHover="hover"
		>
			<motion.span
				aria-hidden="true"
				className="absolute top-0 left-11 block size-24 sm:size-28 lg:size-32"
				transition={photoMotionTransition}
				variants={{ rest: { x: 0, y: 0 }, hover: realPhotoHover }}
			>
				<img
					alt=""
					className="size-full rotate-15 rounded-full border border-border-strong object-cover opacity-95"
					decoding="async"
					draggable={false}
					height={388}
					src="/images/identity/me.webp"
					width={320}
				/>
			</motion.span>
			<motion.span
				aria-hidden="true"
				className="absolute top-8 left-0 block size-24 sm:size-28 lg:size-32"
				transition={photoMotionTransition}
				variants={{ rest: { x: 0, y: 0 }, hover: animePhotoHover }}
			>
				<img
					alt=""
					className="size-full -rotate-8 rounded-full border border-border-strong bg-background object-cover shadow-[0_0_0_5px_var(--background)]"
					decoding="async"
					draggable={false}
					height={320}
					src="/images/identity/me-anime.webp"
					width={320}
				/>
			</motion.span>
		</motion.figure>
	);
}

const photoMotionTransition = {
	type: "spring",
	visualDuration: 0.28,
	bounce: 0.18,
} as const;

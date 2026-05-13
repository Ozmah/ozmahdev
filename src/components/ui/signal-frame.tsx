import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

type SignalFrameAspect = "square" | "tall" | "wide";
type SignalFrameTone = "lime" | "pink" | "muted";

export interface SignalFrameChannel {
	id: string;
	label?: string;
	mode?: "image" | "mask";
	node?: ReactNode;
	src?: string;
}

interface SignalFrameProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	aspect?: SignalFrameAspect;
	channels: SignalFrameChannel[];
	intervalMs?: number;
	tone?: SignalFrameTone;
}

export function SignalFrame({
	aspect = "square",
	channels,
	className,
	intervalMs = 4200,
	tone = "lime",
	...props
}: SignalFrameProps) {
	const shouldReduceMotion = useReducedMotion();
	const [activeIndex, setActiveIndex] = useState(0);
	const activeChannel = channels[activeIndex] ?? channels[0];
	const safeIntervalMs = Math.max(intervalMs, 1800);
	const floatTransition = useMemo(
		() => ({
			duration: shouldReduceMotion ? 0 : 2.6,
			ease: "easeInOut" as const,
			repeat: shouldReduceMotion ? 0 : Number.POSITIVE_INFINITY,
			repeatType: "mirror" as const,
		}),
		[shouldReduceMotion],
	);

	useEffect(() => {
		if (channels.length <= 1 || shouldReduceMotion) {
			return;
		}

		const timer = window.setInterval(() => {
			setActiveIndex((currentIndex) => (currentIndex + 1) % channels.length);
		}, safeIntervalMs);

		return () => window.clearInterval(timer);
	}, [channels.length, safeIntervalMs, shouldReduceMotion]);

	if (!activeChannel) {
		return null;
	}

	return (
		<div
			aria-hidden="true"
			className={cn(
				"relative isolate grid w-full overflow-hidden border border-border-strong bg-background text-current",
				"shadow-[inset_0_0_0_1px_rgb(255_255_255/0.035)]",
				signalFrameAspects[aspect],
				signalFrameTones[tone],
				className,
			)}
			{...props}
		>
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklch,currentColor_14%,transparent),transparent_44%)]" />
			<motion.div
				animate={
					shouldReduceMotion
						? { opacity: 1 }
						: {
								opacity: [0.98, 1, 0.98],
								transform: [
									"translate3d(0,-2.5%,0) rotate(-1.2deg)",
									"translate3d(0,2.5%,0) rotate(1.2deg)",
								],
							}
				}
				className="relative grid h-full place-items-center overflow-hidden p-5 will-change-transform sm:p-7"
				transition={floatTransition}
			>
				<div className="relative size-full">
					<AnimatePresence>
						<motion.div
							animate={
								shouldReduceMotion
									? { opacity: 1 }
									: {
											opacity: [0, 0.78, 1],
											transform: [
												"translate3d(0,1%,0) scale(0.992)",
												"translate3d(0,0,0) scale(1)",
											],
										}
							}
							className="absolute inset-0 grid place-items-center"
							exit={
								shouldReduceMotion
									? { opacity: 0 }
									: {
											opacity: [1, 0.22, 0],
											transform: [
												"translate3d(0,0,0) scale(1)",
												"translate3d(0,-0.75%,0) scale(1.006)",
											],
										}
							}
							initial={
								shouldReduceMotion
									? { opacity: 0 }
									: {
											opacity: 0,
											transform: "translate3d(0,1%,0) scale(0.992)",
										}
							}
							key={activeChannel.id}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.42,
								ease: "easeOut",
							}}
						>
							<SignalFrameChannel channel={activeChannel} />
						</motion.div>
					</AnimatePresence>
				</div>
			</motion.div>

			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgb(255_255_255/0.055)_50%)] bg-size-[100%_4px] opacity-45" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgb(0_0_0/0.58)_100%)]" />
			<div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between border-border border-t pt-2 font-oz-mono text-[0.62rem] text-current uppercase tracking-[0.16em] opacity-80">
				<span>CH {String(activeIndex + 1).padStart(2, "0")}</span>
				<span>{activeChannel.label ?? "Signal"}</span>
			</div>
		</div>
	);
}

function SignalFrameChannel({ channel }: { channel: SignalFrameChannel }) {
	if (channel.src) {
		if (channel.mode === "mask") {
			return (
				<span
					className="block size-[72%] bg-current opacity-90"
					style={{
						mask: `url(${channel.src}) center / contain no-repeat`,
						WebkitMask: `url(${channel.src}) center / contain no-repeat`,
					}}
				/>
			);
		}

		return (
			<img
				alt=""
				className="max-h-[82%] max-w-[82%] object-contain opacity-95"
				draggable={false}
				src={channel.src}
			/>
		);
	}

	return (
		<div className="grid size-full place-items-center text-current">
			{channel.node}
		</div>
	);
}

const signalFrameAspects: Record<SignalFrameAspect, string> = {
	square: "aspect-square",
	tall: "aspect-[3/4]",
	wide: "aspect-[16/9]",
};

const signalFrameTones: Record<SignalFrameTone, string> = {
	lime: "text-accent",
	muted: "text-muted",
	pink: "text-accent-strong",
};

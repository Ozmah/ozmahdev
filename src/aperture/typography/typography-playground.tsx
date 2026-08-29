import {
	motion,
	Reorder,
	useDragControls,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import type {
	KeyboardEvent as ReactKeyboardEvent,
	PointerEvent as ReactPointerEvent,
	RefObject,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
	getTypographyPiece,
	INITIAL_TYPOGRAPHY_COMPOSITION,
	type PlacedTypographyPiece,
	TYPOGRAPHY_PIECES,
	type TypographyPieceDefinition,
	type TypographyPieceId,
} from "./typography-pieces";

const GRID_SIZE = 8;
const MIN_CANVAS_HEIGHT = 720;
const DEFAULT_CANVAS_WIDTH = 512;
const DESKTOP_QUERY = "(min-width: 80rem)";

export function TypographyPlayground() {
	const [pieces, setPieces] = useState<PlacedTypographyPiece[]>(() =>
		createInitialComposition(DEFAULT_CANVAS_WIDTH, MIN_CANVAS_HEIGHT),
	);
	const [selectedId, setSelectedId] = useState<TypographyPieceId | null>(
		"display",
	);
	const [isInteracting, setIsInteracting] = useState(false);
	const [canvasWidth, setCanvasWidth] = useState(DEFAULT_CANVAS_WIDTH);
	const [canvasHeight, setCanvasHeight] = useState(MIN_CANVAS_HEIGHT);
	const [compositionRevision, setCompositionRevision] = useState(0);
	const canvasRef = useRef<HTMLFieldSetElement>(null);
	const isDesktop = useMediaQuery(DESKTOP_QUERY);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const observer = new ResizeObserver(() => {
			const measuredSize = measureCanvasSize(canvas);

			if (measuredSize) {
				setCanvasWidth(measuredSize.width);
				setCanvasHeight(measuredSize.height);
			}
		});

		observer.observe(canvas);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isDesktop) {
			return;
		}

		const frame = requestAnimationFrame(() => {
			const measuredSize = measureCanvasSize(canvasRef.current);

			if (!measuredSize) {
				return;
			}

			setCanvasWidth(measuredSize.width);
			setCanvasHeight(measuredSize.height);
			setPieces((current) =>
				fitCompositionToCanvas(
					current,
					measuredSize.width,
					measuredSize.height,
				),
			);
		});

		return () => cancelAnimationFrame(frame);
	}, [isDesktop]);

	useEffect(() => {
		setPieces((current) =>
			fitCompositionToCanvas(current, canvasWidth, canvasHeight),
		);
	}, [canvasHeight, canvasWidth]);

	const availablePieces = useMemo(() => {
		const placedIds = new Set(pieces.map(({ id }) => id));

		return TYPOGRAPHY_PIECES.filter(({ id }) => !placedIds.has(id));
	}, [pieces]);

	const orderedPieces = useMemo(
		() => [...pieces].sort((a, b) => a.order - b.order),
		[pieces],
	);

	function addPiece(
		id: TypographyPieceId,
		position?: { x: number; y: number },
	) {
		setPieces((current) => {
			if (current.some((piece) => piece.id === id)) {
				return current;
			}

			const definition = getTypographyPiece(id);
			const width = Math.min(
				definition.defaultWidth,
				Math.max(definition.minWidth, canvasWidth - GRID_SIZE * 2),
			);
			const highestZIndex = Math.max(0, ...current.map(({ zIndex }) => zIndex));
			const highestOrder = Math.max(-1, ...current.map(({ order }) => order));
			const x = snap(
				position?.x ?? definition.defaultPosition.x,
				0,
				Math.max(0, canvasWidth - width),
			);
			const y = snap(
				position?.y ?? definition.defaultPosition.y,
				0,
				canvasHeight - 64,
			);

			return [
				...current,
				{
					id,
					order: highestOrder + 1,
					text: definition.defaultText,
					width,
					x,
					y,
					zIndex: highestZIndex + 1,
				},
			];
		});
		setSelectedId(id);
	}

	function addPieceAtPoint(
		id: TypographyPieceId,
		point: { x: number; y: number },
	) {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const bounds = canvas.getBoundingClientRect();
		const left = bounds.left + window.scrollX;
		const top = bounds.top + window.scrollY;

		if (
			point.x < left ||
			point.x > left + bounds.width ||
			point.y < top ||
			point.y > top + bounds.height
		) {
			return;
		}

		const definition = getTypographyPiece(id);
		addPiece(id, {
			x: point.x - left - definition.defaultWidth / 2,
			y: point.y - top - 32,
		});
	}

	function removePiece(id: TypographyPieceId) {
		setPieces((current) => current.filter((piece) => piece.id !== id));
		setSelectedId((current) => (current === id ? null : current));
	}

	function selectPiece(id: TypographyPieceId) {
		setSelectedId(id);
		setPieces((current) => {
			const highestZIndex = Math.max(...current.map(({ zIndex }) => zIndex));
			const selected = current.find((piece) => piece.id === id);

			if (!selected || selected.zIndex === highestZIndex) {
				return current;
			}

			return current.map((piece) =>
				piece.id === id ? { ...piece, zIndex: highestZIndex + 1 } : piece,
			);
		});
	}

	function updateText(id: TypographyPieceId, text: string) {
		setPieces((current) =>
			current.map((piece) => (piece.id === id ? { ...piece, text } : piece)),
		);
	}

	function movePiece(id: TypographyPieceId, x: number, y: number, height = 48) {
		setPieces((current) =>
			current.map((piece) =>
				piece.id === id
					? {
							...piece,
							x: snap(x, 0, Math.max(0, canvasWidth - piece.width)),
							y: snap(y, 0, Math.max(0, canvasHeight - height)),
						}
					: piece,
			),
		);
	}

	function resizePiece(id: TypographyPieceId, width: number) {
		setPieces((current) =>
			current.map((piece) => {
				if (piece.id !== id) {
					return piece;
				}

				const definition = getTypographyPiece(id);

				return {
					...piece,
					width: snap(
						width,
						definition.minWidth,
						Math.max(definition.minWidth, canvasWidth - piece.x),
					),
				};
			}),
		);
	}

	function nudgePiece(
		id: TypographyPieceId,
		deltaX: number,
		deltaY: number,
		height: number,
	) {
		const piece = pieces.find((candidate) => candidate.id === id);

		if (piece) {
			movePiece(id, piece.x + deltaX, piece.y + deltaY, height);
		}
	}

	const fitPieceHeight = useCallback(
		(id: TypographyPieceId, height: number) => {
			setPieces((current) => {
				let changed = false;
				const next = current.map((piece) => {
					if (piece.id !== id) {
						return piece;
					}

					const y = snap(piece.y, 0, Math.max(0, canvasHeight - height));

					if (y === piece.y) {
						return piece;
					}

					changed = true;
					return { ...piece, y };
				});

				return changed ? next : current;
			});
		},
		[canvasHeight],
	);

	function reorderPieces(ids: TypographyPieceId[]) {
		setPieces((current) =>
			current.map((piece) => ({
				...piece,
				order: ids.indexOf(piece.id),
			})),
		);
	}

	function moveMobilePiece(id: TypographyPieceId, direction: -1 | 1) {
		const ids = orderedPieces.map((piece) => piece.id);
		const currentIndex = ids.indexOf(id);
		const nextIndex = clamp(currentIndex + direction, 0, ids.length - 1);

		if (currentIndex === nextIndex) {
			return;
		}

		const [moved] = ids.splice(currentIndex, 1);

		if (moved) {
			ids.splice(nextIndex, 0, moved);
			reorderPieces(ids);
		}
	}

	function resetComposition() {
		const measuredSize = measureCanvasSize(canvasRef.current);
		const currentCanvasWidth = measuredSize?.width ?? canvasWidth;
		const currentCanvasHeight = measuredSize?.height ?? canvasHeight;

		setCanvasWidth(currentCanvasWidth);
		setCanvasHeight(currentCanvasHeight);
		setPieces(
			createInitialComposition(currentCanvasWidth, currentCanvasHeight),
		);
		setSelectedId("display");
		setIsInteracting(false);
		setCompositionRevision((current) => current + 1);
	}

	return (
		<div className="border border-border-strong bg-surface">
			<header className="flex flex-wrap items-start justify-between gap-5 p-5">
				<div>
					<h3 className="m-0 font-oz-mono text-accent text-sm uppercase tracking-[0.12em]">
						Type composer
					</h3>
					<p className="mt-2 mb-0 max-w-2xl text-muted text-sm leading-6">
						<span className="xl:hidden">
							Add type roles, edit their copy, and compare the hierarchy in a
							single column.
						</span>
						<span className="hidden xl:inline">
							Arrange the site's type roles to test hierarchy, wrapping,
							overlap, and measure.
						</span>
					</p>
				</div>
				<button
					className="min-h-11 border border-border px-4 font-oz-mono text-dim text-xs uppercase tracking-[0.1em] hover:border-accent hover:text-accent"
					onClick={resetComposition}
					type="button"
				>
					Reset
				</button>
			</header>

			<div className="border-border border-t xl:grid xl:grid-cols-[minmax(0,1fr)_17rem]">
				<div className="min-w-0 p-4 sm:p-5 xl:h-full">
					<div className="hidden h-full xl:block">
						<DesktopCanvas
							canvasRef={canvasRef}
							canvasHeight={canvasHeight}
							canvasWidth={canvasWidth}
							compositionRevision={compositionRevision}
							isInteracting={isInteracting}
							onDeselect={() => setSelectedId(null)}
							onHeightChange={fitPieceHeight}
							onInteractionChange={setIsInteracting}
							onMove={movePiece}
							onNudge={nudgePiece}
							onRemove={removePiece}
							onResize={resizePiece}
							onSelect={selectPiece}
							onTextChange={updateText}
							pieces={pieces}
							selectedId={selectedId}
							shouldReduceMotion={Boolean(shouldReduceMotion)}
						/>
					</div>

					<div className="xl:hidden">
						<MobileComposition
							onMove={moveMobilePiece}
							onRemove={removePiece}
							onReorder={reorderPieces}
							onTextChange={updateText}
							pieces={orderedPieces}
							shouldReduceMotion={Boolean(shouldReduceMotion)}
						/>
					</div>
				</div>

				<TypographyPalette
					availablePieces={availablePieces}
					isDesktop={isDesktop}
					onAdd={addPiece}
					onDragEnd={addPieceAtPoint}
					onInteractionChange={setIsInteracting}
					placedCount={pieces.length}
					shouldReduceMotion={Boolean(shouldReduceMotion)}
				/>
			</div>
		</div>
	);
}

interface DesktopCanvasProps {
	canvasRef: RefObject<HTMLFieldSetElement | null>;
	canvasHeight: number;
	canvasWidth: number;
	compositionRevision: number;
	isInteracting: boolean;
	onDeselect: () => void;
	onHeightChange: (id: TypographyPieceId, height: number) => void;
	onInteractionChange: (active: boolean) => void;
	onMove: (
		id: TypographyPieceId,
		x: number,
		y: number,
		height?: number,
	) => void;
	onNudge: (
		id: TypographyPieceId,
		deltaX: number,
		deltaY: number,
		height: number,
	) => void;
	onRemove: (id: TypographyPieceId) => void;
	onResize: (id: TypographyPieceId, width: number) => void;
	onSelect: (id: TypographyPieceId) => void;
	onTextChange: (id: TypographyPieceId, text: string) => void;
	pieces: PlacedTypographyPiece[];
	selectedId: TypographyPieceId | null;
	shouldReduceMotion: boolean;
}

function DesktopCanvas({
	canvasRef,
	canvasHeight,
	canvasWidth,
	compositionRevision,
	isInteracting,
	onDeselect,
	onHeightChange,
	onInteractionChange,
	onMove,
	onNudge,
	onRemove,
	onResize,
	onSelect,
	onTextChange,
	pieces,
	selectedId,
	shouldReduceMotion,
}: DesktopCanvasProps) {
	const [activePieceId, setActivePieceId] = useState<TypographyPieceId | null>(
		null,
	);

	useEffect(() => {
		if (!isInteracting) {
			setActivePieceId(null);
		}
	}, [isInteracting]);

	return (
		<fieldset
			className="relative m-0 h-full min-w-0 overflow-hidden border border-border bg-background p-0"
			onPointerDown={(event) => {
				if (event.target === event.currentTarget) {
					onDeselect();
				}
			}}
			ref={canvasRef}
			style={{ minHeight: MIN_CANVAS_HEIGHT }}
		>
			<legend className="sr-only">Typography composition canvas</legend>
			<div
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 transition-opacity duration-150",
					isInteracting ? "opacity-100" : "opacity-35",
				)}
				style={{
					backgroundImage:
						"linear-gradient(to right, color-mix(in oklch, var(--border) 32%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border) 32%, transparent) 1px, transparent 1px)",
					backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
				}}
			/>

			{pieces.length === 0 ? (
				<p className="absolute inset-0 grid place-items-center p-8 text-center font-oz-mono text-dim text-sm">
					Drag a type piece here
				</p>
			) : null}

			{pieces.map((piece) => (
				<DesktopTypographyPiece
					canvasRef={canvasRef}
					canvasHeight={canvasHeight}
					canvasWidth={canvasWidth}
					compositionRevision={compositionRevision}
					isSelected={selectedId === piece.id}
					key={piece.id}
					onInteractionChange={(active) => {
						setActivePieceId(active ? piece.id : null);
						onInteractionChange(active);
					}}
					onMove={onMove}
					onNudge={onNudge}
					onHeightChange={onHeightChange}
					onRemove={onRemove}
					onResize={onResize}
					onSelect={onSelect}
					onTextChange={onTextChange}
					piece={piece}
					showSiblingBounds={
						activePieceId !== null && activePieceId !== piece.id
					}
					shouldReduceMotion={shouldReduceMotion}
				/>
			))}
		</fieldset>
	);
}

interface DesktopTypographyPieceProps {
	canvasRef: RefObject<HTMLFieldSetElement | null>;
	canvasHeight: number;
	canvasWidth: number;
	compositionRevision: number;
	isSelected: boolean;
	onInteractionChange: (active: boolean) => void;
	onMove: (
		id: TypographyPieceId,
		x: number,
		y: number,
		height?: number,
	) => void;
	onNudge: (
		id: TypographyPieceId,
		deltaX: number,
		deltaY: number,
		height: number,
	) => void;
	onHeightChange: (id: TypographyPieceId, height: number) => void;
	onRemove: (id: TypographyPieceId) => void;
	onResize: (id: TypographyPieceId, width: number) => void;
	onSelect: (id: TypographyPieceId) => void;
	onTextChange: (id: TypographyPieceId, text: string) => void;
	piece: PlacedTypographyPiece;
	showSiblingBounds: boolean;
	shouldReduceMotion: boolean;
}

function DesktopTypographyPiece({
	canvasRef,
	canvasHeight,
	canvasWidth,
	compositionRevision,
	isSelected,
	onInteractionChange,
	onMove,
	onNudge,
	onHeightChange,
	onRemove,
	onResize,
	onSelect,
	onTextChange,
	piece,
	showSiblingBounds,
	shouldReduceMotion,
}: DesktopTypographyPieceProps) {
	const definition = getTypographyPiece(piece.id);
	const dragControls = useDragControls();
	const elementRef = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const width = useMotionValue(piece.width);

	useEffect(() => {
		width.set(piece.width);
	}, [piece.width, width]);

	useEffect(() => {
		const element = elementRef.current;

		if (!element) {
			return;
		}

		const observer = new ResizeObserver(() => {
			onHeightChange(piece.id, element.offsetHeight);
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, [onHeightChange, piece.id]);

	useEffect(() => {
		if (
			canvasHeight <= 0 ||
			canvasWidth <= 0 ||
			!Number.isFinite(piece.x) ||
			!Number.isFinite(piece.y)
		) {
			return;
		}

		x.set(0);
		y.set(0);
	}, [canvasHeight, canvasWidth, piece.x, piece.y, x, y]);

	useEffect(() => {
		if (compositionRevision === 0) {
			return;
		}

		x.set(0);
		y.set(0);
	}, [compositionRevision, x, y]);

	function handleDragEnd() {
		const elementHeight = elementRef.current?.offsetHeight ?? 48;
		onMove(piece.id, piece.x + x.get(), piece.y + y.get(), elementHeight);
		x.set(0);
		y.set(0);
		onInteractionChange(false);
	}

	function handleMoveKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
		const distance = GRID_SIZE * (event.shiftKey ? 4 : 1);
		const movement = getArrowMovement(event.key, distance);

		if (!movement) {
			return;
		}

		event.preventDefault();
		onNudge(
			piece.id,
			movement.x,
			movement.y,
			elementRef.current?.offsetHeight ?? 48,
		);
	}

	function handleResizeStart(event: ReactPointerEvent<HTMLButtonElement>) {
		event.preventDefault();
		onSelect(piece.id);
		onInteractionChange(true);

		const startX = event.clientX;
		const startWidth = width.get();
		let nextWidth = startWidth;
		const controller = new AbortController();
		const finishResize = () => {
			controller.abort();
			onResize(piece.id, nextWidth);
			onInteractionChange(false);
		};

		window.addEventListener(
			"pointermove",
			(pointerEvent) => {
				nextWidth = snap(
					startWidth + pointerEvent.clientX - startX,
					definition.minWidth,
					Math.max(definition.minWidth, canvasWidth - piece.x),
				);
				width.set(nextWidth);
			},
			{ signal: controller.signal },
		);
		window.addEventListener("pointerup", finishResize, {
			once: true,
			signal: controller.signal,
		});
		window.addEventListener("pointercancel", finishResize, {
			once: true,
			signal: controller.signal,
		});
	}

	function handleResizeKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
			return;
		}

		event.preventDefault();
		const direction = event.key === "ArrowRight" ? 1 : -1;
		const distance = GRID_SIZE * (event.shiftKey ? 4 : 1);
		onResize(piece.id, piece.width + direction * distance);
	}

	return (
		<motion.div
			className={cn(
				"group absolute border border-dashed p-3",
				isSelected
					? "border-accent bg-background/90"
					: showSiblingBounds
						? "border-border hover:bg-background/70"
						: "border-transparent hover:border-border hover:bg-background/70 focus-within:border-border",
			)}
			drag
			dragConstraints={canvasRef}
			dragControls={dragControls}
			dragElastic={0}
			dragListener={false}
			dragMomentum={false}
			onDragEnd={handleDragEnd}
			onDragStart={() => onInteractionChange(true)}
			onPointerDown={() => onSelect(piece.id)}
			ref={elementRef}
			style={{
				left: piece.x,
				top: piece.y,
				width,
				willChange: "transform",
				x,
				y,
				zIndex: piece.zIndex,
			}}
			whileDrag={shouldReduceMotion ? undefined : { scale: 1.01 }}
		>
			<PieceToolbar
				isVisible={isSelected}
				label={definition.label}
				onMoveKeyDown={handleMoveKeyDown}
				onMovePointerDown={(event) => {
					onSelect(piece.id);
					dragControls.start(event);
				}}
				onRemove={() => onRemove(piece.id)}
			/>

			<TypographyEditor
				definition={definition}
				onChange={(text) => onTextChange(piece.id, text)}
				onFocus={() => onSelect(piece.id)}
				text={piece.text}
			/>

			<button
				aria-label={`Resize ${definition.label}`}
				className={cn(
					"absolute top-0 right-0 z-10 grid h-full w-8 touch-none cursor-ew-resize place-items-center text-dim opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
					isSelected && "opacity-100",
				)}
				onKeyDown={handleResizeKeyDown}
				onPointerDown={handleResizeStart}
				type="button"
			>
				<span aria-hidden="true" className="h-8 w-px bg-current" />
			</button>
		</motion.div>
	);
}

interface PieceToolbarProps {
	isVisible: boolean;
	label: string;
	onMoveKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
	onMovePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
	onRemove: () => void;
}

function PieceToolbar({
	isVisible,
	label,
	onMoveKeyDown,
	onMovePointerDown,
	onRemove,
}: PieceToolbarProps) {
	return (
		<div
			className={cn(
				"absolute -top-5 right-2 z-20 flex border border-border bg-surface opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
				isVisible && "opacity-100",
			)}
		>
			<button
				aria-label={`Move ${label}`}
				className="grid size-10 touch-none cursor-grab place-items-center text-dim hover:text-accent active:cursor-grabbing"
				onKeyDown={onMoveKeyDown}
				onPointerDown={onMovePointerDown}
				type="button"
			>
				<MoveIcon />
			</button>
			<button
				aria-label={`Return ${label} to the piece list`}
				className="grid size-10 place-items-center border-border border-l text-dim hover:text-accent"
				onClick={onRemove}
				type="button"
			>
				<RemoveIcon />
			</button>
		</div>
	);
}

interface MobileCompositionProps {
	onMove: (id: TypographyPieceId, direction: -1 | 1) => void;
	onRemove: (id: TypographyPieceId) => void;
	onReorder: (ids: TypographyPieceId[]) => void;
	onTextChange: (id: TypographyPieceId, text: string) => void;
	pieces: PlacedTypographyPiece[];
	shouldReduceMotion: boolean;
}

function MobileComposition({
	onMove,
	onRemove,
	onReorder,
	onTextChange,
	pieces,
	shouldReduceMotion,
}: MobileCompositionProps) {
	const ids = pieces.map((piece) => piece.id);

	return (
		<div>
			<p className="mt-0 mb-3 font-oz-mono text-dim text-xs uppercase tracking-[0.1em]">
				Composition
			</p>
			{pieces.length === 0 ? (
				<p className="m-0 border border-dashed border-border p-8 text-center font-oz-mono text-dim text-sm">
					Add a type piece to begin
				</p>
			) : (
				<Reorder.Group
					axis="y"
					className="m-0 grid list-none gap-3 p-0"
					onReorder={onReorder}
					values={ids}
				>
					{pieces.map((piece) => (
						<MobileTypographyPiece
							key={piece.id}
							onMove={onMove}
							onRemove={onRemove}
							onTextChange={onTextChange}
							piece={piece}
							shouldReduceMotion={shouldReduceMotion}
						/>
					))}
				</Reorder.Group>
			)}
		</div>
	);
}

interface MobileTypographyPieceProps {
	onMove: (id: TypographyPieceId, direction: -1 | 1) => void;
	onRemove: (id: TypographyPieceId) => void;
	onTextChange: (id: TypographyPieceId, text: string) => void;
	piece: PlacedTypographyPiece;
	shouldReduceMotion: boolean;
}

function MobileTypographyPiece({
	onMove,
	onRemove,
	onTextChange,
	piece,
	shouldReduceMotion,
}: MobileTypographyPieceProps) {
	const definition = getTypographyPiece(piece.id);
	const dragControls = useDragControls();

	function handleMoveKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
		if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
			return;
		}

		event.preventDefault();
		onMove(piece.id, event.key === "ArrowUp" ? -1 : 1);
	}

	return (
		<Reorder.Item
			className="border border-border bg-background p-4"
			dragControls={dragControls}
			dragListener={false}
			dragMomentum={false}
			value={piece.id}
			whileDrag={
				shouldReduceMotion
					? undefined
					: { boxShadow: "0 12px 28px rgb(0 0 0 / 0.28)" }
			}
		>
			<div className="mb-4 flex items-center justify-between gap-4">
				<p className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.1em]">
					{definition.label}
				</p>
				<div className="flex">
					<button
						aria-label={`Reorder ${definition.label}`}
						className="grid size-11 touch-none cursor-grab place-items-center text-dim hover:text-accent active:cursor-grabbing"
						onKeyDown={handleMoveKeyDown}
						onPointerDown={(event) => dragControls.start(event)}
						type="button"
					>
						<MoveIcon />
					</button>
					<button
						aria-label={`Return ${definition.label} to the piece list`}
						className="grid size-11 place-items-center text-dim hover:text-accent"
						onClick={() => onRemove(piece.id)}
						type="button"
					>
						<RemoveIcon />
					</button>
				</div>
			</div>
			<TypographyEditor
				definition={definition}
				onChange={(text) => onTextChange(piece.id, text)}
				text={piece.text}
			/>
		</Reorder.Item>
	);
}

interface TypographyEditorProps {
	definition: TypographyPieceDefinition;
	onChange: (text: string) => void;
	onFocus?: () => void;
	text: string;
}

function TypographyEditor({
	definition,
	onChange,
	onFocus,
	text,
}: TypographyEditorProps) {
	return (
		<textarea
			aria-label={`Edit ${definition.label} text`}
			className={cn(
				"block w-full resize-none overflow-hidden border-0 bg-transparent px-0 pt-0 pb-[0.15em] outline-none [field-sizing:content]",
				definition.editorClassName,
			)}
			onChange={(event) => onChange(event.target.value)}
			onFocus={onFocus}
			rows={definition.rows}
			spellCheck={definition.id !== "mono"}
			value={text}
		/>
	);
}

interface TypographyPaletteProps {
	availablePieces: readonly TypographyPieceDefinition[];
	isDesktop: boolean;
	onAdd: (id: TypographyPieceId) => void;
	onDragEnd: (id: TypographyPieceId, point: { x: number; y: number }) => void;
	onInteractionChange: (active: boolean) => void;
	placedCount: number;
	shouldReduceMotion: boolean;
}

function TypographyPalette({
	availablePieces,
	isDesktop,
	onAdd,
	onDragEnd,
	onInteractionChange,
	placedCount,
	shouldReduceMotion,
}: TypographyPaletteProps) {
	return (
		<aside className="border-border border-t p-4 sm:p-5 xl:border-t-0 xl:border-l">
			<div className="flex items-baseline justify-between gap-4">
				<h4 className="m-0 font-oz-mono text-accent text-xs uppercase tracking-[0.1em]">
					Pieces
				</h4>
				<p className="m-0 font-oz-mono text-dim text-xs tabular-nums">
					{placedCount}/{TYPOGRAPHY_PIECES.length}
				</p>
			</div>

			{availablePieces.length === 0 ? (
				<p className="mt-6 mb-0 text-muted text-sm leading-6">
					Every type role is on the canvas.
				</p>
			) : (
				<ul className="mt-4 grid list-none gap-3 p-0">
					{availablePieces.map((piece) => (
						<PalettePiece
							definition={piece}
							isDesktop={isDesktop}
							key={piece.id}
							onAdd={onAdd}
							onDragEnd={onDragEnd}
							onInteractionChange={onInteractionChange}
							shouldReduceMotion={shouldReduceMotion}
						/>
					))}
				</ul>
			)}
		</aside>
	);
}

interface PalettePieceProps {
	definition: TypographyPieceDefinition;
	isDesktop: boolean;
	onAdd: (id: TypographyPieceId) => void;
	onDragEnd: (id: TypographyPieceId, point: { x: number; y: number }) => void;
	onInteractionChange: (active: boolean) => void;
	shouldReduceMotion: boolean;
}

function PalettePiece({
	definition,
	isDesktop,
	onAdd,
	onDragEnd,
	onInteractionChange,
	shouldReduceMotion,
}: PalettePieceProps) {
	const dragControls = useDragControls();

	return (
		<motion.li
			className="relative border border-border bg-background p-3"
			drag={isDesktop}
			dragControls={dragControls}
			dragElastic={0}
			dragListener={false}
			dragMomentum={false}
			dragSnapToOrigin
			layout={!shouldReduceMotion}
			onDragEnd={(_, info) => {
				onInteractionChange(false);
				onDragEnd(definition.id, info.point);
			}}
			onDragStart={() => onInteractionChange(true)}
			whileDrag={
				shouldReduceMotion
					? undefined
					: {
							boxShadow: "0 16px 32px rgb(0 0 0 / 0.32)",
							scale: 1.02,
							zIndex: 50,
						}
			}
		>
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="m-0 font-oz-mono text-accent text-[0.65rem] uppercase tracking-[0.1em]">
						{definition.label}
					</p>
					<p className="mt-1 mb-0 font-oz-mono text-dim text-[0.65rem]">
						{definition.fontName}
					</p>
				</div>
				{isDesktop ? (
					<button
						aria-label={`Drag ${definition.label} to the canvas`}
						className="grid size-11 touch-none cursor-grab place-items-center text-dim hover:text-accent active:cursor-grabbing"
						onPointerDown={(event) => dragControls.start(event)}
						type="button"
					>
						<MoveIcon />
					</button>
				) : null}
			</div>
			<p className={cn("mt-4 mb-0", definition.previewClassName)}>
				{definition.defaultText.split("\n")[0]}
			</p>
			<p className="mt-3 mb-0 text-muted text-xs leading-5">
				{definition.purpose}
			</p>
			<button
				className="mt-4 min-h-11 w-full border border-border px-3 font-oz-mono text-dim text-xs uppercase tracking-[0.08em] hover:border-accent hover:text-accent"
				onClick={() => onAdd(definition.id)}
				type="button"
			>
				Add to composition
			</button>
		</motion.li>
	);
}

function MoveIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-4"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<circle cx="5" cy="4" r="1.25" />
			<circle cx="11" cy="4" r="1.25" />
			<circle cx="5" cy="8" r="1.25" />
			<circle cx="11" cy="8" r="1.25" />
			<circle cx="5" cy="12" r="1.25" />
			<circle cx="11" cy="12" r="1.25" />
		</svg>
	);
}

function RemoveIcon() {
	return (
		<svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
			<path
				d="m4 4 8 8m0-8-8 8"
				stroke="currentColor"
				strokeLinecap="square"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		const updateMatches = () => setMatches(mediaQuery.matches);

		updateMatches();
		mediaQuery.addEventListener("change", updateMatches);

		return () => mediaQuery.removeEventListener("change", updateMatches);
	}, [query]);

	return matches;
}

function createInitialComposition(canvasWidth: number, canvasHeight: number) {
	return fitCompositionToCanvas(
		INITIAL_TYPOGRAPHY_COMPOSITION.map((piece) => ({ ...piece })),
		canvasWidth,
		canvasHeight,
	);
}

function fitCompositionToCanvas(
	pieces: readonly PlacedTypographyPiece[],
	canvasWidth: number,
	canvasHeight: number,
) {
	return pieces.map((piece) => {
		const definition = getTypographyPiece(piece.id);
		const width = snap(
			piece.width,
			definition.minWidth,
			Math.max(definition.minWidth, canvasWidth - GRID_SIZE * 2),
		);

		return {
			...piece,
			width,
			x: snap(piece.x, 0, Math.max(0, canvasWidth - width)),
			y: snap(piece.y, 0, Math.max(0, canvasHeight - 64)),
		};
	});
}

function measureCanvasSize(canvas: HTMLFieldSetElement | null) {
	if (!canvas || canvas.clientWidth <= 0 || canvas.clientHeight <= 0) {
		return null;
	}

	return {
		height: canvas.clientHeight,
		width: canvas.clientWidth,
	};
}

function getArrowMovement(key: string, distance: number) {
	if (key === "ArrowLeft") {
		return { x: -distance, y: 0 };
	}

	if (key === "ArrowRight") {
		return { x: distance, y: 0 };
	}

	if (key === "ArrowUp") {
		return { x: 0, y: -distance };
	}

	if (key === "ArrowDown") {
		return { x: 0, y: distance };
	}

	return null;
}

function snap(value: number, minimum: number, maximum: number) {
	const snappedMinimum = Math.ceil(minimum / GRID_SIZE) * GRID_SIZE;
	const snappedMaximum = Math.floor(maximum / GRID_SIZE) * GRID_SIZE;

	if (snappedMaximum < snappedMinimum) {
		return snappedMinimum;
	}

	return clamp(
		Math.round(value / GRID_SIZE) * GRID_SIZE,
		snappedMinimum,
		snappedMaximum,
	);
}

function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(Math.max(value, minimum), maximum);
}

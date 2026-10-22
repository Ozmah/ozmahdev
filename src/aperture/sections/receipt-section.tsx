import { ReceiptGenerator } from "../receipt/receipt-generator";

export function ReceiptSection() {
	return (
		<section className="border-oz-line border-t py-8" id="receipt-canvas">
			<h2 className="mb-3 text-balance font-oz-mono text-sm uppercase tracking-wide text-accent">
				Receipt Canvas
			</h2>
			<p className="mb-6 mt-0 max-w-[68ch] text-pretty text-base/7 text-muted sm:text-sm/6">
				Turns typed transaction data into a designed, fixed-size visual
				artifact. The rotation control changes the actual pixels—not merely the
				preview.
			</p>
			<ReceiptGenerator />
		</section>
	);
}

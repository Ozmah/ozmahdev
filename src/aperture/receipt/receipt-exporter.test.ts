import { describe, expect, it } from "vitest";
import { canvasToReceiptPng, createReceiptFileName } from "./receipt-exporter";

describe("receipt exporter", () => {
	it("creates a safe PNG filename from the receipt number", () => {
		expect(createReceiptFileName(" NS/2026: 0042 ")).toBe(
			"receipt-ns-2026-0042.png",
		);
		expect(createReceiptFileName("   ")).toBe("receipt-sale.png");
	});

	it("resolves the PNG blob produced by canvas", async () => {
		const png = new Blob(["png"], { type: "image/png" });
		const canvas = {
			toBlob(callback: BlobCallback, type?: string) {
				expect(type).toBe("image/png");
				callback(png);
			},
		} as HTMLCanvasElement;

		await expect(canvasToReceiptPng(canvas)).resolves.toBe(png);
	});

	it("rejects when canvas cannot encode the image", async () => {
		const canvas = {
			toBlob(callback: BlobCallback) {
				callback(null);
			},
		} as HTMLCanvasElement;

		await expect(canvasToReceiptPng(canvas)).rejects.toThrow(
			"The browser could not encode the receipt as PNG.",
		);
	});
});

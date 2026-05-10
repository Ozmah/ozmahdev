import {
	PowerlinePrompt,
	TerminalCursor,
	TerminalFrame,
	TerminalLine,
} from "@/components/ui/terminal-frame";

export function TerminalSection() {
	return (
		<section className="border-oz-line border-t py-8">
			<h2 className="font-oz-mono text-oz-lime mb-6 text-sm uppercase tracking-wider">
				Terminal Frame
			</h2>
			<div className="grid gap-8 xl:grid-cols-2">
				<TerminalFrame title="Windows PowerShell" variant="powershell">
					<TerminalLine tone="command">Windows PowerShell</TerminalLine>
					<TerminalLine>
						Copyright (C) Microsoft Corporation. Todos los derechos reservados.
					</TerminalLine>
					<TerminalLine tone="muted"> </TerminalLine>
					<TerminalLine tone="command">
						PS C:\Users\ozmah&gt; bun run glados
					</TerminalLine>
					<TerminalLine tone="success">✓ build complete</TerminalLine>
				</TerminalFrame>

				<TerminalFrame title="Ubuntu" variant="ubuntu">
					<PowerlinePrompt path="~/dev/ozmah-dev" time="01:38:23" />
					<TerminalLine tone="command">
						bun run dev
						<TerminalCursor />
					</TerminalLine>
					<TerminalLine tone="success">
						VITE ready at http://localhost:3000
					</TerminalLine>
				</TerminalFrame>

				<TerminalFrame title="ozmah.dev" variant="minimal">
					<TerminalLine tone="command">$ systemctl status homelab</TerminalLine>
					<TerminalLine tone="success">
						Active: active (running) since 2h 13m ago
					</TerminalLine>
					<TerminalLine>
						Tesseract booting · cameras pending · storage online
					</TerminalLine>
				</TerminalFrame>

				<TerminalFrame title="Build Notes" variant="minimal">
					<TerminalLine tone="command">$ git commit -m "ship it"</TerminalLine>
					<TerminalLine>write code · break · fix · repeat</TerminalLine>
					<TerminalLine tone="success">…you don’t give up</TerminalLine>
				</TerminalFrame>
			</div>
		</section>
	);
}

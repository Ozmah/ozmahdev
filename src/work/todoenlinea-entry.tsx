import { WorkEntryShell } from "./work-entry-shell";
import { WorkImage } from "./work-image";

export function TodoEnLineaEntry() {
	return (
		<WorkEntryShell
			description={
				<p className="mt-0">
					This is the landing page for TodoEnLinea. The page focuses on what
					matters: explain the offer, keep the page readable and make the next
					step obvious for the user.
				</p>
			}
			meta="2026"
			title="TodoEnLinea Landing"
		>
			<WorkImage
				alt="TodoEnLinea landing page"
				caption="Landing page"
				height={1304}
				src="/work/todoenlinea-landing-2026.png"
				width={2305}
			/>
		</WorkEntryShell>
	);
}

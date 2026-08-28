import { WorkEntryShell } from "./work-entry-shell";
import { WorkImage } from "./work-image";

export function ConsultappEntry() {
	return (
		<WorkEntryShell
			description={
				<>
					<p className="mt-0">
						Consultapp is an internal product for managing commercial records,
						users, ledgers, document generation, and the day to day work around
						those processes. Currently serving clients in all of Mexico for
						TodoEnLinea.
					</p>
				</>
			}
			meta="2026"
			title="Consultapp"
		>
			<div className="grid gap-5 xl:grid-cols-3">
				<WorkImage
					alt="Consultapp commercial records screen"
					caption="Commercial records"
					height={1306}
					loading="eager"
					src="/work/consultapp-commercial-2026.png"
					width={1710}
				/>
				<WorkImage
					alt="Consultapp users management screen"
					caption="Users"
					height={1301}
					src="/work/consultapp-users-2026.png"
					width={2296}
				/>
				<WorkImage
					alt="Consultapp ledger screen"
					caption="Ledger"
					height={1304}
					src="/work/consultapp-ledger-2026.png"
					width={1711}
				/>
			</div>
		</WorkEntryShell>
	);
}

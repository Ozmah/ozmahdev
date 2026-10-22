import { ApertureTabs } from "../aperture/aperture-tabs";
import { ApertureHeader } from "../aperture/sections/aperture-header";

export default function ApertureApp() {
	return (
		<div className="mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8 lg:px-0">
			<h1 className="sr-only">OzmahDev Aperture component lab</h1>
			<ApertureHeader />
			<ApertureTabs />
		</div>
	);
}

import { MedalImage } from "./MedalImage";

export const MedalsModule = () => {
	return (
		<div className="
			grid grid-cols-5 grid-rows-2
			place-content-center place-items-center
			gap-5
			p-5
		">
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
			<MedalImage />
		</div>
	);
}
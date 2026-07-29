import { Medal } from "../components/image/Medal";

export const MedalsModule = () => {
	return (
		<div className="
			grid grid-cols-5 grid-rows-2
			place-content-center place-items-center
			gap-5
			p-5
		">
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
			<Medal />
		</div>
	);
}
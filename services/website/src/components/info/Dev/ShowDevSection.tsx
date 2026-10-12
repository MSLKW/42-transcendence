import { useDevStore } from "../../../store/DevStore";

export const ShowDevSection = () => {
	const showDevSection = useDevStore((store) => store.showDevSection);
	const toggleFlag = useDevStore((store) => store.toggleFlag);

	return (
		<div
			className="
				flex flex-col
				place-content-center place-items-center
				py-3rem
			"
		>
			<button
				type="button"
				onClick={() => toggleFlag("showDevSection")}
				className="
					btn-text bg-light
					text-n0
					h-3rem aspect-6/1
				"
			>
				{ showDevSection ? "Hide Dev Section" : "Show Dev Section"}
			</button>
		</div>
	);
}
import { useSceneStore } from "../store/useSceneStore";

export const StatsWindow = () => {
	const setShowWindow = useSceneStore((state) => state.setShowWindow);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("stats", false)}/>
			<div className="
				w-100 h-100
				bg-linear-to-b from-n0 to-n1
			">
			</div>
		</section>
	);
}
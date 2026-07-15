import { useSceneStore } from "../store/useSceneStore";
import { AvatarButton } from "./Avatar";
import { CloseButton } from "./CloseButton";
import { usePlayerStore } from "../store/PlayerStore";

export const Medal = () => {
	return (
		<div className="h-10 aspect-square rounded-full bg-a4" />
	);
}

export const StatsWindow = () => {
	const setShowWindow = useSceneStore((state) => state.setShowWindow);
	const playerIndex = usePlayerStore((state) => state.playerIndex);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("stats", false)}/>
			<div className="
				w-max h-max rounded-xl
				bg-linear-to-b from-n0 to-n1
				border border-n1
				relative
			">
				<div className="
					flex place-content-evenly place-items-center
					p-5
					gap-5
					border-b border-n2
				">
					<AvatarButton playerIndex={playerIndex}/>
					<div className="grid grid-cols-5 grid-rows-2 gap-2">
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
				</div>
				<div className="
					grid grid-cols-3
					place-content-evenly place-items-end
					divide-x divide-n2
					text-n6
				">
					<div className="
						w-full h-full
						col-start-1 col-end-1
						text-center
						p-5
					">
						<h2>Total Played</h2>
						<p>42</p>
					</div>
					<div className="
						w-full h-full
						col-start-2 col-end-2
						text-center
						p-5
					">
						<h2>Wins</h2>
						<p>5</p>
					</div>
					<div className="
						w-full h-full
						col-start-3 col-end-3
						text-center
						p-5
					">
						<h2>Win Streak</h2>
						<p>2</p>
					</div>
				</div>
				<div className="
					absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={() => setShowWindow("stats", false)}/>
				</div>
			</div>
		</section>
	);
}
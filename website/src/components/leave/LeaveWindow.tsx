import { useGameStore } from "../../store/GameStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";

export const LeaveWindow = () => {
	return (
		<Window
			title="WARNING!"
			dismissKey="leave"
			headerType="Warning"
			lightbox={true}
		>
			<div className="
				flex flex-col
				py-3rem px-3rem gap-2.5rem
			">
				<div className="
					flex flex-col place-content-center place-items-center
					gap-1rem
					text-n6
				">
					<h2>Leaving now will result in a loss</h2>
					<h2>Are you sure?</h2>
				</div>
				<div className="
					flex
					gap-1rem
				">
					<button
						onClick={() => {
							useSceneStore.getState().setShowWindow("leave", false);
							useGameStore.getState().endGame();
						}}
						className="
							h-3rem aspect-5/1
							btn-text bg-r2
							text-n6
					">
						LEAVE
					</button>
					<button
						onClick={() => useSceneStore.getState().setShowWindow("leave", false)}
						className="
							h-3rem aspect-5/1
							btn-text bg-light
							text-n0
					">
						STAY
					</button>
				</div>
			</div>
		</Window>
	);
}
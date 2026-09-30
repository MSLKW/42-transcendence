import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";

export const StaleWindow = () => {
	return (
		<Window
			title="Session terminated"
			dismissKey="stale"
			hasPinButton={false}
			headerType="Warning"
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
					<h2>You're logged in another device</h2>
				</div>
				<div className="
					flex place-content-center
					gap-1rem
				">
					<button
						onClick={() => useSceneStore.getState().setShowWindow("stale", false)}
						className="
							h-3rem aspect-5/1
							btn-text bg-r2
							text-n6
					">
						OK
					</button>
				</div>
			</div>
		</Window>
	);
}
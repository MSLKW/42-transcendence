import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";

export const StaleWindow = () => {
	return (
		<div className="z-999">
			<div
				className="
					absolute top-0 left-0 z-1
					h-screen w-screen
					backdrop-blur-xs
					pointer-events-auto
			"/>
			<Window
				title="Session terminated"
				dismissKey={""}
				hasPinButton={false}
				headerType="None"
				isDismissable={false}
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
							onClick={() => useSceneStore.getState().setCurrentScene("Login")}
							className="
								h-3rem aspect-5/1
								btn-text bg-r2
								text-n6
						">
							Back to login
						</button>
					</div>
				</div>
			</Window>
		</div>
	);
}
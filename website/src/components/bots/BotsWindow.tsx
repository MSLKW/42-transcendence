import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { BotSetButton } from "./button/BotSetButton";

export const BotsWindow = () => {
	const { setShowWindow } = useSceneStore();

	return (
		<>
			<button
				className="
					fixed z-1 top-0 left-0
					h-screen w-screen
					backdrop-blur-xs
					pointer-events-none
				"
			/>
			<Window
				title="Bots"
				dismissKey="bots"
				hasHeader={false}
			>
				<div
					className="
						divide-n2/40 divide-y-2
					"
				>
					<div
						className="
							py-2rem px-3rem
							flex
						"
					>
						<BotSetButton name="Easy" />
						<BotSetButton name="Medium" />
						<BotSetButton name="Hard" />
					</div>
					<div
						className="
							flex flex-col
							place-content-center place-items-center
							gap-1rem
							py-2rem
						"
					>
						<h3 className="text-n6">
							Select bot difficulty...
						</h3>
						<button
							onClick={() => setShowWindow("bots", false)}
							className="
								h-3rem aspect-5/1
								btn-text bg-light
							"
						>
							OK!
						</button>
					</div>
				</div>
			</Window>
		</>
	);
}
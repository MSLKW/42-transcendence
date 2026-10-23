import { handleLogout } from "../../api/authentication/delete_logout/handleLogout";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";

export const LeaveWindow = () => {
	const members = usePartyStore((store) => store.members);
	const currentScene = useSceneStore((store) => store.currentScene);

	const handleLeaveClick = () => {
		useSceneStore.getState().setShowWindow("leave", false);
		if (currentScene === "Home")
			handleLogout();
		else
			useGameStore.getState().leaveGame();
	}

	return (
		<Window
			title={
				currentScene === "Game" ? "WARNING!" :
				currentScene === "Lobby" ? "Host in control" :
				"Confirmation Needed"
			}
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
					{
						currentScene === "Game" ? <h2>Leaving this game will result in a loss {members.length > 1 && "and kicked from party"}</h2> :
						currentScene === "Lobby" ? <h2>Leaving now will result in being kicked from party</h2> :
						<h2>You are about to sign out from the game</h2>
					}
					<h2>Are you sure?</h2>
				</div>
				<div className="
					flex place-content-center place-items-center
					gap-1rem
				">
					<button
						onClick={() => useSceneStore.getState().setShowWindow("leave", false)}
						className="
							h-3rem aspect-5/1
							btn-text bg-light
							text-n0
					">
						CANCEL
					</button>
					<button
						onClick={handleLeaveClick}
						className="
							h-3rem aspect-5/1
							btn-text bg-r2
							text-n6
					">
						{currentScene === "Home" ? "SIGN OUT" : "LEAVE"}
					</button>
				</div>
			</div>
		</Window>
	);
}
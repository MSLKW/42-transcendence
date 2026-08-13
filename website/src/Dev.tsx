import { useState, useEffect } from "react";
import { handleSignOut } from "./api/authentication/sign_out/handleSignOut";
import { partySocket } from "./api/party/partySocket";
import { useDevStore } from "./store/DevStore";
import { useFriendStore } from "./store/FriendStore";
import { useGameStore } from "./store/GameStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { fillWithBots } from "./components/lobby/LobbyScene";

interface DevBtnProps {
	label: string,
	call: () => void,
}

const DevBtn = ({ label, call }: DevBtnProps) => {
	return (
		<li>
			<button
				type="button"
				tabIndex={-1}
				onClick={call}
				className="
					hover:scale-105
					text-r4 hover:text-r5
					cursor-pointer
				"
			>
				{label}
			</button>
		</li>
	);
}

export default function Dev() {
	const { showFrame, toggleFlag } = useDevStore();
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('frame-mode');
		else
			document.documentElement.classList.remove('frame-mode');
	}, [showFrame]);

	const { friendUuids } = useFriendStore();
	const { seats, totalPlayers, incTotalWin, incTotalLoss } = useGameStore();
	const { partySocketId, partyGameId, members, set1PlayerParty } = usePartyStore();
	const { clientUuid, isAuthenticated, validateResponse, profilesInDb, resetProfilesInDb } = useProfileStore();
	const { currentScene, setCurrentScene } = useSceneStore();

	const [inviteUuid, setInviteUuid] = useState("");

	const handleReset = async () => {
		resetProfilesInDb();
		await handleSignOut();
		console.log("[Dev] Game have been reset");
	}

	const handlePartyConnection = () => {
		if (partySocket.isSocketActive()) {
			partySocket.disconnect();
			set1PlayerParty();
		} else
			partySocket.connect();
	}

	const humansSeated = seats.filter((seat): seat is string => typeof seat === "string").length;

	return (
		<section className="w-full text-r4 py-1rem">
			<ul className="flex place-content-evenly">
				<DevBtn label="Login" call={() => setCurrentScene("LOGIN")}/>
				<DevBtn label="Home" call={() => setCurrentScene("HOME")}/>
				<DevBtn label="Lobby" call={() => setCurrentScene("LOBBY")}/>
				<DevBtn label="Test" call={() => setCurrentScene("TEST")}/>
				<DevBtn label="Gameplay" call={() => setCurrentScene("GAMEPLAY")}/>
			</ul>
			<ul className="flex place-content-evenly">
				<DevBtn label="Frame" call={() => toggleFlag("showFrame")} />
				<DevBtn label="Stats" call={() => toggleFlag("showStats")} />
				<DevBtn label="Reset" call={handleReset} />
			</ul>
			{ currentScene === "GAMEPLAY" && 
				<ul className="flex place-content-evenly">
					<DevBtn label="Results" call={() => setCurrentScene('RESULTS')}/>
					<DevBtn label="Win Round" call={() => incTotalWin(clientUuid!)}/>
					<DevBtn label="Lose Round" call={() => incTotalLoss(clientUuid!)}/>
				</ul>
			}
			<ul className="flex place-content-center place-items-center gap-1rem">
				<input
					id="inviteUuid"
					onChange={(e) => setInviteUuid(e.target.value)}
					className="
						bg-dark w-[70%]
					"
				/>
				<DevBtn label="Invite" call={() => partySocket.sendInvite(inviteUuid)}/>
			</ul>
			<ul className="flex flex-col px-3rem">
				<div className="flex place-content-between">
					<li>Client UUID: {clientUuid ? clientUuid : "n/a"}</li>
					<DevBtn label={`isAuthenticated: ${isAuthenticated ? "Yes" : "No"}`} call={() => console.log("/validate response: ", validateResponse)}/>
				</div>
				<div className="flex place-content-between">
					<li>Profile Manager Socket ID: n/a</li>
					<DevBtn label={`profilesInDb: ${profilesInDb.length}`} call={() => console.log("profilesInDb: ", profilesInDb)} />
				</div>
				<div className="flex place-content-between">
					<DevBtn
						label={`Party Manager Socket ID: ${partySocketId ? partySocketId : "n/a"}`}
						call={handlePartyConnection}
					/>
					<DevBtn label={`members: ${members.length}`} call={() => console.log("members: ", members)}/>
				</div>
				<li>Party Game ID: {partyGameId ? partyGameId : "n/a"}</li>
				<div className="flex place-content-between">
					<li>Game Manager Socket ID: n/a</li>
					<DevBtn label={`seats: ${humansSeated} / ${totalPlayers}`} call={() => console.log("seats: ", seats)} />
				</div>
				<div className="flex place-content-between">
					<li>Friend Manager Socket ID: n/a</li>
					<DevBtn label={`friendUuids: ${friendUuids.length}`} call={() => console.log("friendUuids: ", friendUuids)} />
				</div>
				<div className="flex place-content-between">
					<li>Bot Manager Socket ID: n/a</li>
					{/* {currentScene === "LOBBY" && <DevBtn label="Fill with Bots" call={fillWithBots} />} */}
				</div>
				<li>Chat Manager Socket ID: n/a</li>
			</ul>
		</section>
	);
}
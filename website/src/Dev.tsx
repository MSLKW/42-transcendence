import { useState } from "react";
import { handleSignOut } from "./api/authentication/sign_out/handleSignOut";
import { partySocket } from "./api/party/partySocket";
import { useBotStore } from "./store/BotStore";
import { useDevStore } from "./store/DevStore";
import { useFriendStore } from "./store/FriendStore";
import { useGameStore, HAND_LABEL, type HAND_TYPE } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useResultsStore } from "./store/ResultsStore";
import { useSceneStore } from "./store/SceneStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/useFrameView";

export default function Dev() {
	const { fillSeatsWithBots, removeBots } = useBotStore();
	const { toggleFlag } = useDevStore();
	const { friendUuids } = useFriendStore();
	const { seats, totalPlayers, playerUnseats, currentHand, setGameValue, round, endGame } = useGameStore();
	const { showNotification } = useNotificationStore();
	const { partySocketId, partyGameId, members, set1PlayerParty, hostUuid, getMemberData } = usePartyStore();
	const { clientUuid, isAuthenticated, validateResponse, profilesInDb, resetProfilesInDb } = useProfileStore();
	const { results } = useResultsStore();
	const { currentScene, setCurrentScene } = useSceneStore();
	const [inviteUuid, setInviteUuid] = useState("");

	const handleResetAll = async () => {
		resetProfilesInDb();
		await handleSignOut();
		setCurrentScene("Login");
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

	useFrameView();

	const playerWins = (player: number) => {
		const newCardsLeft = Array.from({ length: totalPlayers }, (_, index) => {
			return (Math.abs(totalPlayers - (index - player)) % totalPlayers) * 3;
		});
		setGameValue("cardsLeft", newCardsLeft);
	}

	return (
		<section className="w-full text-r4 py-1rem">
			<ul className="flex place-content-evenly">
				<DevButton label="Frame" call={() => toggleFlag("showFrame")} />
				<DevButton label="Stats" call={() => toggleFlag("showStats")} />
				<DevButton label="Reset All" call={handleResetAll} />
			</ul>
			<ul className="flex place-content-evenly px-3rem">
				<DevButton label="Notify Message" call={() => showNotification("This is a message notification", NOTIFICATION_TYPE.message)} />
				<DevButton label="Notify Invite" call={() => showNotification("This is an invite notification", NOTIFICATION_TYPE.invite)} />
				<DevButton label="Notify Error" call={() => showNotification("This is an error notification", NOTIFICATION_TYPE.error)} />
			</ul>
			<ul className="flex place-content-evenly">
				{ currentScene === "Game" && clientUuid === hostUuid &&
					<>
						{ seats[0] && <DevButton label={`${getMemberData(seats[0])?.name} Wins`} call={() => playerWins(0)}/> }
						{ seats[1] && <DevButton label={`${getMemberData(seats[1])?.name} Wins`} call={() => playerWins(1)}/> }
						{ seats[2] && <DevButton label={`${getMemberData(seats[2])?.name} Wins`} call={() => playerWins(2)}/> }
						{ seats[3] && <DevButton label={`${getMemberData(seats[3])?.name} Wins`} call={() => playerWins(3)}/> }
					</>
				}
				<DevButton label={`results: ${ results.length }`} call={() => console.log("results: ", results)}/>
				<DevButton label="End Game" call={() => endGame()}/>
			</ul>
			<ul className="flex place-content-center place-items-center gap-1rem">
				<input
					id="inviteUuid"
					onChange={(e) => setInviteUuid(e.target.value)}
					className="bg-dark w-[70%]"
				/>
				<DevButton label="Invite" call={() => partySocket.sendInvite(inviteUuid)}/>
			</ul>
			<ul className="flex flex-col px-3rem">
				<div className="flex place-content-between">
					<li>Client UUID: {clientUuid ? clientUuid : "n/a"}</li>
					<DevButton label={`isAuthenticated: ${isAuthenticated ? "Yes" : "No"}`} call={() => console.log("/validate response: ", validateResponse)}/>
				</div>
				<div className="flex place-content-between">
					<li>Profile Manager Socket ID: n/a</li>
					<DevButton label={`profilesInDb: ${profilesInDb.length}`} call={() => console.log("profilesInDb: ", profilesInDb)} />
				</div>
				<div className="flex place-content-between">
					<DevButton
						label={`Party Manager Socket ID: ${partySocketId ? partySocketId : "n/a"}`}
						call={handlePartyConnection}
					/>
					<DevButton label={`members: ${members.length}`} call={() => console.log("members: ", members)}/>
				</div>
				<div className="flex place-content-between">
					<li>Party Game ID: {partyGameId ? partyGameId : "n/a"}</li>
					<li>Round: {round}</li>
					<DevButton label={`seats: ${humansSeated} / ${totalPlayers}`} call={() => console.log("seats: ", seats)} />
				</div>
				<div className="flex place-content-between">
					<li>Game Manager Socket ID: n/a</li>
					<select
						id="currentHand"
						value={currentHand}
						onChange={(e) => {setGameValue("currentHand", e.target.value as HAND_TYPE)}}
					>
						{HAND_LABEL.map((hand) => (
							<option
								key={hand}
								value={hand}
							>
								{hand}
							</option>
						))}
					</select>
				</div>
				<div className="flex place-content-between">
					<li>Friend Manager Socket ID: n/a</li>
					<DevButton label={`friendUuids: ${friendUuids.length}`} call={() => console.log("friendUuids: ", friendUuids)} />
				</div>
				<div className="flex place-content-between">
					<li>Bot Manager Socket ID: n/a</li>
					{currentScene === "Lobby" && <DevButton label="Fill Bots" call={() => fillSeatsWithBots()} />}
					{currentScene === "Lobby" && <DevButton label="Remove Bots" call={() => removeBots()} />}
					{currentScene === "Lobby" && <DevButton label="Unseat" call={() => playerUnseats(clientUuid!)} />}
				</div>
				<li>Chat Manager Socket ID: n/a</li>
			</ul>
		</section>
	);
}
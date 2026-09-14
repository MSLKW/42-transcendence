import { useState } from "react";
import { handleSignOut } from "./api/authentication/sign_out/handleSignOut";
import { handleValidate } from "./api/authentication/validate/handleValidate";
import { useChatStore } from "./store/ChatStore";
import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { useBotStore } from "./store/BotStore";
import { useDevStore } from "./store/DevStore";
import { useFriendStore } from "./store/FriendStore";
import { useGameStore, HAND_LABEL, type HAND_TYPE } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore, cachedBotData } from "./store/ProfileStore";
import { useResultsStore } from "./store/ResultsStore";
import { defaultShowWindow, useSceneStore } from "./store/SceneStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/useFrameView";

export default function Dev() {
	const { fillSeatsWithBots, removeBots } = useBotStore();
	const { chatSocketId, chatRoomId } = useChatStore();
	const { toggleFlag } = useDevStore();
	const { cachedFriends } = useFriendStore();
	const { seats, totalPlayers, playerUnseats, currentHand } = useGameStore();
	const { showNotification } = useNotificationStore();
	const { partySocketId, partyGameId, members, hostUuid } = usePartyStore();
	const { clientUuid, isAuthenticated, validateResponse, profilesInDb, resetProfilesInDb, cachedData, getCachedData } = useProfileStore();
	const { results } = useResultsStore();
	const { currentScene, setCurrentScene } = useSceneStore();
	const [fetchUrl, setFetchUrl] = useState("");
	const [fetchBody, setFetchBody] = useState("");

	const handleResetAll = async () => {
		resetProfilesInDb();
		await handleSignOut();
		setCurrentScene("Login");
		useSceneStore.setState({ showWindow: defaultShowWindow });
		useChatStore.setState({ cachedChat: [] });
		console.log("[Dev] Game have been reset");
	}

	const handlePartyConnection = () => {
		if (partySocket.isConnected()) {
			partySocket.disconnect();
			chatSocket.disconnect();
		} else {
			partySocket.connect();
			chatSocket.connect();
		}
	}

	const handleChatConnection = () => {
		if (chatSocket.isConnected()) {
			chatSocket.disconnect();
			return;
		}

		chatSocket.connect();
		useChatStore.setState({ chatReconnect: useChatStore.getState().chatReconnect + 1 });
	}

	const seated = seats.filter((seat): seat is string => typeof seat === "string").length;

	useFrameView();

	const playerWins = (player: number) => {
		const newCardsLeft = Array.from({ length: totalPlayers }, (_, index) => {
			return (Math.abs(totalPlayers - (index - player)) % totalPlayers) * 3;
		});
		useGameStore.setState({ cardsLeft: newCardsLeft });
	}

	const doValidate = async () => {
		await handleValidate();
	};

	const fetchGet = async (url: string) => {
		try {
			const response = await fetch(`${url}`, {
				method: "GET",
				credentials: "include",
			});
			const resp_json = await response?.json();
			console.log("[GET ", url, "] ", response.status, " ", response.statusText, " - ", resp_json);
		} catch (err) {
			console.error("fetchGet failed");
		}
	}

	const fetchPut = async (url: string, body: string) => {
		try {
			const response = await fetch(`${url}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const resp_json = await response?.json();
			console.log("[PUT ", url, " ", body, "] ", response.status, " ", response.statusText, " - ", resp_json);
		} catch (err) {
			console.error("fetchPut failed");
		}
	}

	return (
		<section className="w-full text-b4 py-1rem gap-1rem flex flex-col px-3rem">
			{/* utilities */}
				<ul className="flex place-content-between">
					<DevButton label="Frame" call={() => toggleFlag("showFrame")} />
					<DevButton label="Stats" call={() => toggleFlag("showStats")} />
					<DevButton label="Reset All" call={handleResetAll} />
				</ul>
			{/* notification */}
				<ul className="flex place-content-between">
					<DevButton label="Notify Message" call={() => showNotification("This is a message notification", NOTIFICATION_TYPE.message)} />
					<DevButton label="Notify Invite" call={() => showNotification("This is an invite notification", NOTIFICATION_TYPE.invite)} />
					<DevButton label="Notify Error" call={() => showNotification("This is an error notification", NOTIFICATION_TYPE.error)} />
				</ul>
			{/* authentication */}
				<ul className="flex place-content-between">
					<DevButton label={`clientUuid: ${clientUuid ? clientUuid : "n/a"}`} call={() => navigator.clipboard.writeText(clientUuid ?? "")}/>
					<DevButton label="Validate" call={doValidate}/>
					<DevButton label={`isAuthenticated: ${isAuthenticated ? "Yes" : "No"}`} call={() => console.log("/validate response: ", validateResponse)}/>
				</ul>
			{/* fetch */}
				<ul className="flex place-content-between gap-1rem">
					<input
						id="inviteUuid"
						onChange={(e) => setFetchUrl(e.target.value)}
						className="bg-dark w-[70%]"
					/>
					<input
						id="inviteUuid"
						onChange={(e) => setFetchBody(e.target.value)}
						className="bg-dark w-[70%]"
					/>
					<DevButton label="GET" call={() => fetchGet(fetchUrl)}/>
					<DevButton label="PUT" call={() => fetchPut(fetchUrl, fetchBody)}/>
				</ul>
			{/* seats */}
				<ul className="flex place-content-between">
					{ currentScene === "Game" && clientUuid === hostUuid &&
						<>
							{ seats[0] && <DevButton label={`${getCachedData(seats[0])?.name} Wins`} call={() => playerWins(0)}/> }
							{ seats[1] && <DevButton label={`${getCachedData(seats[1])?.name} Wins`} call={() => playerWins(1)}/> }
							{ seats[2] && <DevButton label={`${getCachedData(seats[2])?.name} Wins`} call={() => playerWins(2)}/> }
							{ seats[3] && <DevButton label={`${getCachedData(seats[3])?.name} Wins`} call={() => playerWins(3)}/> }
						</>
					}
				</ul>
			{/* profile */}
				<ul className="flex place-content-between">
					<DevButton label={`profilesInDb: ${profilesInDb.length}`} call={() => console.log("profilesInDb: ", profilesInDb)} />
					<DevButton label={`cachedData: ${cachedData.length}`} call={() => useProfileStore.setState({ cachedData: cachedBotData })} />
				</ul>
			{/* party */}
				<ul className="flex place-content-between">
					<DevButton
						label={`partySocketId: ${partySocketId ? partySocketId : "n/a"}`}
						call={handlePartyConnection}
					/>
					<li>hostUuid: {hostUuid ? hostUuid : "n/a"} </li>
				</ul>
				<ul className="flex place-content-between">
					<DevButton label={`members: ${members.length}`} call={() => console.log("members: ", members)}/>
					<DevButton label={`seats: ${seated} / ${totalPlayers}`} call={() => console.log("seats: ", seats)} />
					<DevButton label="refresh" call={() => partySocket.refresh()}/>
					<li>partyGameId: {partyGameId ? partyGameId : "n/a"}</li>
				</ul>
			{/* game */}
				<ul className="flex place-content-between">
					<li>gameSocketId: n/a</li>
					<DevButton label={`results: ${ results.length }`} call={() => console.log("results: ", results)}/>
					<select
						id="currentHand"
						value={currentHand}
						onChange={(e) => useGameStore.setState({ currentHand: e.target.value as HAND_TYPE })}
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
				</ul>
			{/* chat */}
				<ul className="flex place-content-between">
					<DevButton
						label={`chatSocketId: ${chatSocketId}`}
						call={handleChatConnection}
					/>
					<DevButton
						label={`chatRoomId: ${chatRoomId ? chatRoomId : "n/a"}`}
						call={() => useChatStore.setState({ chatRoomId: hostUuid })}
					/>
				</ul>
			{/* friends */}
				<ul className="flex place-content-between">
					<DevButton label={`cachedFriends: ${cachedFriends.length}`} call={() => console.log("cachedFriends: ", cachedFriends)} />
				</ul>
			{/* bots */}
				<ul className="flex place-content-between">
					{currentScene === "Lobby" && <DevButton label="Fill Bots" call={() => fillSeatsWithBots()} />}
					{currentScene === "Lobby" && <DevButton label="Remove Bots" call={() => removeBots()} />}
					{currentScene === "Lobby" && <DevButton label="Unseat" call={() => playerUnseats(clientUuid!)} />}
				</ul>
		</section>
	);
}
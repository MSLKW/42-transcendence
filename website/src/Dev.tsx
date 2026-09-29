import { useState } from "react";
import { handleSignOut } from "./api/authentication/sign_out/handleSignOut";
import { useChatStore } from "./store/ChatStore";
import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { useAuthStore } from "./store/AuthStore";
import { useBotStore } from "./store/BotStore";
import { useDevStore } from "./store/DevStore";
import { useFriendStore } from "./store/FriendStore";
import { useGameStore } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useResultsStore } from "./store/ResultsStore";
import { defaultShowWindow, useSceneStore } from "./store/SceneStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/react/useFrameView";

export default function Dev() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const fillSeatsWithBots = useBotStore((store) => store.fillSeatsWithBots);
	const removeBots = useBotStore((store) => store.removeBots);
	const chatVerboseMode = useChatStore((store) => store.chatVerboseMode);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const toggleFlag = useDevStore((store) => store.toggleFlag);
	const cachedFriends = useFriendStore((store) => store.cachedFriends);
	const gameVerboseMode = useGameStore((store) => store.gameVerboseMode);
	const gameSocketId = useGameStore((store) => store.gameSocketId);
	const userSeats = useGameStore((store) => store.userSeats);
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const leaveSeat = useGameStore((store) => store.leaveSeat);
	const notifications = useNotificationStore((store) => store.notifications);
	const showNotification = useNotificationStore((store) => store.showNotification);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const resetProfilesInDb = useProfileStore((store) => store.resetProfilesInDb);
	const cachedData = useProfileStore((store) => store.cachedData);
	const results = useResultsStore((store) => store.results);
	const sceneVerboseMode = useSceneStore((store) => store.sceneVerboseMode);
	const showWindow = useSceneStore((store) => store.showWindow);
	const currentScene = useSceneStore((store) => store.currentScene);
	const setCurrentScene = useSceneStore((store) => store.setCurrentScene);

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
	}

	const seated = userSeats.filter((seat): seat is string => typeof seat === "string").length;

	useFrameView();

	const playerWins = (player: number) => {
		const newCardsLeft = Array.from({ length: totalPlayers }, (_, index) => {
			return (Math.abs(totalPlayers - (index - player)) % totalPlayers) * 3;
		});
		useGameStore.setState({ cardsLeft: newCardsLeft });
	}

	const fetchGet = async (url: string) => {
		try {
			const response = await fetch(`${url}`, {
				method: "GET",
				credentials: "include",
			});
			const resp_json = await response.json();
			console.log("[GET ", url, "] status:", response.status, " statusText:", response.statusText, " response:", response, " response.json:", resp_json);
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
					<DevButton label={`notifications:${notifications.length}`} call={() => console.log("notifications:", notifications)} />
				</ul>
			{/* scene */}
				<ul className="flex place-content-between">
					<DevButton label={`showWindow: ${Object.values(showWindow).filter(Boolean).length}`} call={() => console.log("showWindow:", showWindow)}/>
					<DevButton label={`sceneVerboseMode: ${sceneVerboseMode}`} call={() => useSceneStore.setState({ sceneVerboseMode: !sceneVerboseMode })}/>
				</ul>
			{/* fetch */}
				<ul className="flex place-content-between gap-1rem">
					<input
						id="inviteUuid"
						onChange={(e) => setFetchUrl(e.target.value)}
						className="bg-dark-semi w-[70%]"
					/>
					<input
						id="inviteUuid"
						onChange={(e) => setFetchBody(e.target.value)}
						className="bg-dark-semi w-[70%]"
					/>
					<DevButton label="GET" call={() => fetchGet(fetchUrl)}/>
					<DevButton label="PUT" call={() => fetchPut(fetchUrl, fetchBody)}/>
				</ul>
			{/* authentication */}
				<ul className="flex place-content-between">
					<DevButton label={`clientUuid: ${clientUuid}`} call={() => clientUuid && navigator.clipboard.writeText(clientUuid)}/>
					<DevButton label={`authVerboseMode: ${authVerboseMode}`} call={() => useAuthStore.setState({ authVerboseMode: !authVerboseMode })}/>
				</ul>
			{/* profile */}
				<ul className="flex place-content-between">
					<DevButton label={`cachedData: ${Object.keys(cachedData).length}`} call={() => console.log(useProfileStore.getState().cachedData)} />
					<DevButton label="Clear cachedData" call={() => useProfileStore.getState().clearCachedData()} />
					<DevButton label={`profileVerboseMode: ${profileVerboseMode}`} call={() => useProfileStore.setState({ profileVerboseMode: !profileVerboseMode })}/>
				</ul>
			{/* party */}
				<ul className="flex place-content-between">
					<DevButton
						label={`partySocketId: ${partySocketId}`}
						call={handlePartyConnection}
					/>
					<DevButton label={`partyVerboseMode: ${partyVerboseMode}`} call={() => usePartyStore.setState({ partyVerboseMode: !partyVerboseMode })}/>
				</ul>
				<ul className="flex place-content-between">
					<li>hostUuid: {`${hostUuid}`} </li>
					<DevButton label={`members: ${members.length}`} call={() => console.log("members: ", members)}/>
				</ul>
				<ul className="flex place-content-between">
					<li>partyGameId: {`${partyGameId}`}</li>
					<DevButton label={`seats: ${seated} / ${totalPlayers}`} call={() => console.log("seats: ", userSeats)} />
					<DevButton label="refresh" call={() => partySocket.refresh()}/>
				</ul>
			{/* game */}
				<ul className="flex place-content-between">
					<li>gameSocketId: {`${gameSocketId}`}</li>
					<DevButton label={`results: ${ results.length }`} call={() => console.log("results: ", results)}/>
					<DevButton
						label={`gameVerboseMode: ${gameVerboseMode}`}
						call={() => useGameStore.setState({ gameVerboseMode: !gameVerboseMode })}
					/>
				</ul>
			{/* chat */}
				<ul className="flex place-content-between">
					<DevButton
						label={`chatSocketId: ${chatSocketId}`}
						call={handleChatConnection}
					/>
				</ul>
				<ul className="flex place-content-between">
					<DevButton
						label={`chatRoomId: ${chatRoomId}`}
						call={() => useChatStore.setState({ chatRoomId: hostUuid })}
					/>
					<DevButton
						label={`chatVerboseMode: ${chatVerboseMode}`}
						call={() => useChatStore.setState({ chatVerboseMode: !chatVerboseMode })}
					/>
				</ul>
			{/* friends */}
				<ul className="flex place-content-between">
					<DevButton label={`cachedFriends: ${cachedFriends.length}`} call={() => console.log("cachedFriends: ", cachedFriends)} />
				</ul>
			{/* seats */}
				{ currentScene === "Game" && clientUuid === hostUuid &&
					<ul className="flex place-content-between">
						<>
							{ userSeats[0] && <DevButton label={`${cachedData[userSeats[0]]?.name ?? "Seat 0 "} Wins`} call={() => playerWins(0)}/> }
							{ userSeats[1] && <DevButton label={`${cachedData[userSeats[1]]?.name ?? "Seat 1 "} Wins`} call={() => playerWins(1)}/> }
							{ userSeats[2] && <DevButton label={`${cachedData[userSeats[2]]?.name ?? "Seat 2 "} Wins`} call={() => playerWins(2)}/> }
							{ userSeats[3] && <DevButton label={`${cachedData[userSeats[3]]?.name ?? "Seat 3 "} Wins`} call={() => playerWins(3)}/> }
						</>
					</ul>
				}
			{/* bots */}
				<ul className="flex place-content-between">
					{currentScene === "Lobby" && <DevButton label="Fill Bots" call={() => fillSeatsWithBots()} />}
					{currentScene === "Lobby" && <DevButton label="Remove Bots" call={() => removeBots()} />}
					{currentScene === "Lobby" && <DevButton label="Unseat" call={() => leaveSeat()} />}
				</ul>
		</section>
	);
}
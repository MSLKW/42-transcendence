<<<<<<< HEAD
import { useState } from "react";
import { handleSignOut } from "./api/authentication/sign_out/handleSignOut";
import { handleValidate } from "./api/authentication/validate/handleValidate";
import { useChatStore } from "./store/ChatStore";
import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { useAuthStore } from "./store/AuthStore";
import { useBotStore } from "./store/BotStore";
import { useDevStore } from "./store/DevStore";
import { useFriendStore } from "./store/FriendStore";
import { useGameStore, HAND_LABEL, type HAND_TYPE } from "./store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useResultsStore } from "./store/ResultsStore";
import { defaultShowWindow, useSceneStore } from "./store/SceneStore";
import { DevButton } from "./components/dev/DevBtn";
import { useFrameView } from "./utilities/useFrameView";

export default function Dev() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const fillSeatsWithBots = useBotStore((store) => store.fillSeatsWithBots);
	const removeBots = useBotStore((store) => store.removeBots);
	const chatSocketId = useChatStore((store) => store.chatSocketId);
	const chatRoomId = useChatStore((store) => store.chatRoomId);
	const toggleFlag = useDevStore((store) => store.toggleFlag);
	const cachedFriends = useFriendStore((store) => store.cachedFriends);
	const userSeats = useGameStore((store) => store.userSeats);
	const gameSeats = useGameStore((store) => store.gameSeats);
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const leaveSeat = useGameStore((store) => store.leaveSeat);
	const currentHand = useGameStore((store) => store.currentHand);
	const showNotification = useNotificationStore((store) => store.showNotification);
	const partySocketId = usePartyStore((store) => store.partySocketId);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const isAuthenticated = useProfileStore((store) => store.isAuthenticated);
	const validateResponse = useProfileStore((store) => store.validateResponse);
	const profilesInDb = useProfileStore((store) => store.profilesInDb);
	const resetProfilesInDb = useProfileStore((store) => store.resetProfilesInDb);
	const cachedData = useProfileStore((store) => store.cachedData);
	const results = useResultsStore((store) => store.results);
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
		useChatStore.setState({ chatReconnect: useChatStore.getState().chatReconnect + 1 });
	}

	const userSeated = userSeats.filter((seat): seat is string => typeof seat === "string").length;
	const gameSeated = gameSeats.filter((seat): seat is string => typeof seat === "string").length;

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
							{ userSeats[0] && <DevButton label={`${cachedData[userSeats[0]]?.name ?? "Seat 0 "} Wins`} call={() => playerWins(0)}/> }
							{ userSeats[1] && <DevButton label={`${cachedData[userSeats[1]]?.name ?? "Seat 1 "} Wins`} call={() => playerWins(1)}/> }
							{ userSeats[2] && <DevButton label={`${cachedData[userSeats[2]]?.name ?? "Seat 2 "} Wins`} call={() => playerWins(2)}/> }
							{ userSeats[3] && <DevButton label={`${cachedData[userSeats[3]]?.name ?? "Seat 3 "} Wins`} call={() => playerWins(3)}/> }
						</>
					}
				</ul>
			{/* profile */}
				<ul className="flex place-content-between">
					<DevButton label={`profilesInDb: ${profilesInDb.length}`} call={() => console.log("profilesInDb: ", profilesInDb)} />
					<DevButton label={`cachedData: ${Object.keys(cachedData).length}`} call={() => console.log(useProfileStore.getState().cachedData)} />
					<DevButton label="Clear cachedData" call={() => useProfileStore.getState().clearCachedData()} />
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
					<DevButton label={`userSeats: ${userSeated} / ${totalPlayers}`} call={() => console.log("userSeats: ", userSeats)} />
					<DevButton label={`gameSeats: ${gameSeated} / ${totalPlayers}`} call={() => console.log("gameSeats: ", gameSeats)} />
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
					{currentScene === "Lobby" && <DevButton label="Unseat" call={() => leaveSeat()} />}
				</ul>
		</section>
	);
}
=======
import { useEffect } from "react";
import { useDevStore } from "./store/DevStore";
import { useGameStore } from "./store/GameStore";
import { usePartyStore, RELATION, SEATNUMBER_UNSEATED } from "./store/PartyStore";
import { useSceneStore } from "./store/SceneStore";
import { usePlayerStore } from "./store/PlayerStore";

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
	const { showFrame, toggleFlag, resetGame } = useDevStore();
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('frame-mode');
		else
			document.documentElement.classList.remove('frame-mode');
	}, [showFrame]);

	const { currentScene, setCurrentScene } = useSceneStore();
	const { gameStarted } = useGameStore();
	useEffect(() => {
		console.log("gameStarted", gameStarted);
	}, [currentScene]);
	
	const { totalMembers, addMember } = usePartyStore();
	const { incTotalWins, incTotalLoss } = usePlayerStore();

	return (
		<section className="w-full text-r4">
			<ul className="flex place-content-evenly">
				<DevBtn label="Login" call={() => setCurrentScene("LOGIN")}/>
				<DevBtn label="Home" call={() => setCurrentScene("HOME")}/>
				<DevBtn label="Lobby" call={() => setCurrentScene("LOBBY")}/>
				<DevBtn label="Gameplay" call={() => setCurrentScene("GAMEPLAY")}/>
				<DevBtn label="R3F" call={() => setCurrentScene("R3F")}/>
			</ul>
			<ul className="flex place-content-evenly">
				<DevBtn label="Frame" call={() => toggleFlag("showFrame")}/>
				<DevBtn label="Stats" call={() => toggleFlag("showStats")}/>
				<DevBtn label="Reset" call={() => resetGame()}/>
			</ul>
			{ (currentScene === "HOME" || currentScene === "LOBBY") && totalMembers <= TEST_MEMBERS.length &&
				<ul className="flex place-content-evenly">
					<DevBtn
						label={`Add ${TEST_MEMBERS[totalMembers - 1].name} As Party Member`}
						call={() => addMember(TEST_MEMBERS[totalMembers - 1])}/>
				</ul>
			}
			{ (currentScene === "R3F" || currentScene === "GAMEPLAY") && 
				<ul className="flex place-content-evenly">
					<DevBtn label="Results" call={() => setCurrentScene('RESULTS')}/>
					<DevBtn label="Win Round" call={() => incTotalWins()}/>
					<DevBtn label="Lose Round" call={() => incTotalLoss()}/>
				</ul>
			}
		</section>
	);
}

const TEST_MEMBERS = [
	{
		uuid: "12345678-abcd-efgh-ijkl-111111111111",
		name: "Dev-Azrul",
		avatar: "avatar-stock-1.webp",
		badge: "Beginner's Luck",
		level: 10,
		xp: 1000,
		createdAt: "1 July 2026",
		lastLogin: "1 July 2026",
		totalPlayed: 10,
		totalWins: 5,
		totalLoss: 5,
		winStreak: 5,
		achievements: {
			FIRST_LOGIN: null,
			LOGIN_1_WEEK: null,
			PLAYED_1_GAME: null,
			PLAYED_10_GAMES: null,
			PLAYED_42_GAMES: null,
			FIRST_WIN: null,
			WIN_STREAK_2: null,
			WIN_STREAK_5: null,
			WIN_STREAK_10: null,
			MASTER_COLLECTOR: null,
		},
		relation: RELATION.STRANGER,
		isHost: false,
		seatNumber: SEATNUMBER_UNSEATED,
	},
	{
		uuid: "12345678-abcd-efgh-ijkl-222222222222",
		name: "Dev-Max",
		avatar: "avatar-stock-2.webp",
		badge: "Challenger",
		level: 20,
		xp: 2000,
		createdAt: "2 July 2026",
		lastLogin: "2 July 2026",
		totalPlayed: 20,
		totalWins: 10,
		totalLoss: 10,
		winStreak: 10,
		achievements: {
			FIRST_LOGIN: null,
			LOGIN_1_WEEK: null,
			PLAYED_1_GAME: null,
			PLAYED_10_GAMES: null,
			PLAYED_42_GAMES: null,
			FIRST_WIN: null,
			WIN_STREAK_2: null,
			WIN_STREAK_5: null,
			WIN_STREAK_10: null,
			MASTER_COLLECTOR: null,
		},
		relation: RELATION.FRIEND,
		isHost: false,
		seatNumber: SEATNUMBER_UNSEATED,
	},
	{
		uuid: "12345678-abcd-efgh-ijkl-333333333333",
		name: "Dev-Jeremy",
		avatar: "avatar-stock-3.webp",
		badge: "Enthusiast",
		level: 30,
		xp: 3000,
		createdAt: "3 July 2026",
		lastLogin: "3 July 2026",
		totalPlayed: 30,
		totalWins: 15,
		totalLoss: 15,
		winStreak: 15,
		achievements: {
			FIRST_LOGIN: null,
			LOGIN_1_WEEK: null,
			PLAYED_1_GAME: null,
			PLAYED_10_GAMES: null,
			PLAYED_42_GAMES: null,
			FIRST_WIN: null,
			WIN_STREAK_2: null,
			WIN_STREAK_5: null,
			WIN_STREAK_10: null,
			MASTER_COLLECTOR: null,
		},
		relation: RELATION.FRIEND,
		isHost: false,
		seatNumber: SEATNUMBER_UNSEATED,
	},
	{
		uuid: "12345678-abcd-efgh-ijkl-444444444444",
		name: "Dev-Aisyah",
		avatar: "avatar-stock-4.webp",
		badge: "Risk Taker",
		level: 40,
		xp: 4000,
		createdAt: "4 July 2026",
		lastLogin: "4 July 2026",
		totalPlayed: 40,
		totalWins: 20,
		totalLoss: 20,
		winStreak: 20,
		achievements: {
			FIRST_LOGIN: null,
			LOGIN_1_WEEK: null,
			PLAYED_1_GAME: null,
			PLAYED_10_GAMES: null,
			PLAYED_42_GAMES: null,
			FIRST_WIN: null,
			WIN_STREAK_2: null,
			WIN_STREAK_5: null,
			WIN_STREAK_10: null,
			MASTER_COLLECTOR: null,
		},
		relation: RELATION.STRANGER,
		isHost: false,
		seatNumber: SEATNUMBER_UNSEATED,
	},
] as const;
>>>>>>> origin/int/KAN-36-website-db

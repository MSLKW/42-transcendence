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
	const { data, incTotalWins, incTotalLoss } = usePlayerStore();

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
			<ul className="flex place-content-evenly">
				<li>Session token: {data.sessionToken}</li>
				<li>UUID: {data.uuid}</li>
			</ul>
		</section>
	);
}

const TEST_MEMBERS = [
	{
		sessionToken: "",
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
		sessionToken: "",
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
		sessionToken: "",
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
		sessionToken: "",
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
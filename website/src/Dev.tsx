import { useEffect } from "react";
import { useDevStore } from "./store/DevStore";
import { useGameStore } from "./store/GameStore";
import { usePartyStore, ISFRIEND } from "./store/PartyStore";
import { useSceneStore } from "./store/SceneStore";
import { usePlayerStore } from "./store/PlayerStore";

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
	
	const { partyCount, addMember } = usePartyStore();
	const { incTotalWins, incTotalLoss } = usePlayerStore();

	return (
		<section className="w-full h-fit text-r4">
			<ul className="flex place-content-evenly">
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOGIN')}>Login</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('HOME')}>Home</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('R3F')}>R3F</button></li>
			</ul>
			<ul className="flex place-content-evenly">
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showFrame")}>Frame</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showStats")}>Stats</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('RESULTS')}>Results</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => resetGame()}>Reset</button></li>
			</ul>
			<ul className="flex place-content-evenly">
				{ partyCount <= TEST_MEMBERS.length &&
					<li>
						<button
							type="button"
							tabIndex={-1}
							onClick={() => addMember(TEST_MEMBERS[partyCount - 1])}
						>
							Add "{TEST_MEMBERS[partyCount - 1].name}" As Party Member
						</button>
					</li>
				}
			</ul>
			<ul className="flex place-content-evenly">
				<li><button type="button" tabIndex={-1} onClick={() => incTotalWins()}>Win Round</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => incTotalLoss()}>Lose Round</button></li>
			</ul>
		</section>
	);
}

const TEST_MEMBERS = [
	{
		uuid: "12345678901234567890123456789012",
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
		seatNumber: -1,
		isFriend: ISFRIEND.TRUE,
		isHost: false,
	},
	{
		uuid: "12345678901234567890123456789012",
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
		seatNumber: -1,
		isFriend: ISFRIEND.FALSE,
		isHost: false,
	},
	{
		uuid: "12345678901234567890123456789012",
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
		seatNumber: -1,
		isFriend: ISFRIEND.TRUE,
		isHost: false,
	},
	{
		uuid: "12345678901234567890123456789012",
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
		seatNumber: -1,
		isFriend: ISFRIEND.TRUE,
		isHost: false,
	},
] as const;
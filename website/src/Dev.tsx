import { useEffect } from "react";
import { useDevStore } from "./store/DevStore";
import { useGameStore } from "./store/GameStore";
import { usePartyStore, ISFRIEND } from "./store/PartyStore";
import { useSceneStore } from "./store/SceneStore";

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

	return (
		<section className="w-full h-fit">
			<ul className="ul-dev flex-wrap gap-x-5">
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOGIN')}>Login</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('HOME')}>Home</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('R3F')}>R3F</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showFrame")}>Frame</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showStats")}>Stats</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('RESULTS')}>Results</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => resetGame()}>Reset</button></li>
			</ul>
			<ul className="ul-dev">
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
		</section>
	);
}

const TEST_MEMBERS = [
	{
		uuid: "12345678901234567890123456789012",
		name: "Dev-Azrul",
		avatar: "avatar-stock-1.webp",
		badge: "Newcomer",
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
		badge: "Newcomer",
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
		badge: "Newcomer",
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
		badge: "Newcomer",
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
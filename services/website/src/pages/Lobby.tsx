<<<<<<< HEAD
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useGameStore } from "../store/useGameStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton } from "../components/Settings";
import { InfoButton } from "../components/Info";
import { EmojiButton } from "../components/EmojiButtons";
import { AvatarButton } from "../components/Avatar";
import { ChatButton } from "../components/Chat";
import { PartyButton } from "../components/Party";
import { SmallLogo } from "../components/Logo";

export const Lobby = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	
	const containerRef = useRef(null);
	useEffect(() => {
		if (!containerRef.current)
			return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setContAreaWidth(entry.target.scrollWidth);
				setContAreaHeight(entry.target.scrollHeight);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	const gameMode = useGameStore((state) => state.gameMode);
	const partyCount = useGameStore((state) => state.partyCount);

	return (
		<>
			<section ref={containerRef} className="cont-canvas">
				<Canvas>
					{showStats && <Stats />}
					<AdaptiveDpr />
					{/* <ambientLight intensity={0.5}/> */}
					<directionalLight position={[0, 0, 5]} intensity={1} />
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
			</section>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton />
						<InfoButton />
					</div>
					<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
				<main className="flex flex-col place-content-evenly place-items-evenly">
					<div className={`
						w-full h-full
						grid ${ gameMode === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
						place-content-evenly place-items-center
					`}>
						{ gameMode === 4 && <AvatarButton key={2} playerIndex={2} /> }
						{ gameMode === 3 &&
							<>
								<AvatarButton key={1} playerIndex={1} />
								<AvatarButton key={2} playerIndex={2} />
							</>
						}
						{ gameMode === 2 && <AvatarButton key={1} playerIndex={1} /> }
					</div>
					<div className={`
						w-full h-full
						grid ${gameMode === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
					`}>
						{ gameMode === 4 && <AvatarButton key={1} playerIndex={1} /> }
						<button
							className="btn-white hw-4/1"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						{ gameMode === 4 && <AvatarButton key={3} playerIndex={3} /> }
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						<AvatarButton key={0} playerIndex={0} role="self" />
					</div>
				</main>
				<footer className="
					pointer-events-auto
					flex place-content-between place-items-center
					relative
				">
					<div tabIndex={-1} className="
						z-1
						flex
						gap-[clamp(0.25rem,3vw+0.125rem,2.5rem)]
						sm:overflow-x-visible overflow-x-auto
					">
						{ partyCount > gameMode && 
							Array.from({ length: partyCount - gameMode }, (_, index) => {
								const playerIndex = gameMode + index;
								return (
									<AvatarButton key={playerIndex} playerIndex={playerIndex} />
								)
							})
						}
						<PartyButton />
					</div>
					<SmallLogo />
				</footer>
			</section>
		</>
	);
}
=======
import { useEffect } from "react";
import { useSceneStore } from "../store/SceneStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore, RELATION } from "../store/PartyStore";
import { HeaderModule } from "../modules/Header";
import { SmallLogo } from "../modules/Logo";
import { AvatarButton } from "../components/button/Avatar";
import { PartyButton } from "../components/button/Party";

export const Lobby = () => {
	const { totalPlayers } = useGameStore();
	const { members, gameMode, totalMembers, addMember } = usePartyStore();
	const { setCurrentScene } = useSceneStore();

	useEffect(() => {
		let currentTotal = members.length;
		while (currentTotal < gameMode) {
			const botIndex = currentTotal;
			const template = BOT_MEMBERS[(botIndex - 1) % BOT_MEMBERS.length];

			addMember({
				...template,
				uuid: `bot-${botIndex}`,
				name: `Bot-${botIndex}`,
				seatNumber: botIndex,
			});
			currentTotal++;
		}
	}, [gameMode]);

	return (
		<>
			<HeaderModule back="HOME"/>
			<main className="flex flex-col place-content-evenly place-items-evenly">
				<div className={`
					h-full
					grid ${ totalPlayers === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
					place-content-evenly place-items-center
				`}>
					{ totalPlayers === 4 && members[2] &&
						<AvatarButton
							key={members[2].uuid}
							index={2}
							name={members[2].name ?? "Guest"}
							relation={members[2].relation}
							cornerButton={members[2].isHost ? "host" : ""}
						/>
					}
					{ totalPlayers === 3 &&
						<>
							{ members[1] && 
								<AvatarButton
									key={members[1].uuid}
									index={1}
									name={members[1].name ?? "Guest"}
									relation={members[1].relation}
									cornerButton={members[1].isHost ? "host" : ""}
								/>
							}
							{ members[2] && 
								<AvatarButton
									key={members[2].uuid}
									index={2}
									name={members[2].name ?? "Guest"}
									relation={members[2].relation}
									cornerButton={members[2].isHost ? "host" : ""}
								/>
							}
						</>
					}
					{ totalPlayers === 2 && members[1] &&
						<AvatarButton
							key={members[1].uuid}
							index={1}
							name={members[1].name ?? "Guest"}
							relation={members[1].relation}
							cornerButton={members[1].isHost ? "host" : ""}
						/>
					}
				</div>
				<div className={`
					w-full h-full
					grid ${totalPlayers === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
				`}>
					{ totalPlayers === 4 && members[1] &&
						<AvatarButton
							key={members[1].uuid}
							index={1}
							name={members[1].name ?? "Guest"}
							relation={members[1].relation}
							cornerButton={members[1].isHost ? "host" : ""}
						/>
					}
					<button
						onClick={() => setCurrentScene("R3F")}
						className="
							btn-text bg-light
							h-3rem aspect-4/1
							text-1.25rem text-n0
						"
					>
						START
					</button>
					{ totalPlayers === 4 && members[3] &&
						<AvatarButton
							key={members[3].uuid}
							index={3}
							name={members[3].name ?? "Guest"}
							relation={members[3].relation}
							cornerButton={members[3].isHost ? "host" : ""}
						/>
					}
				</div>
				<div className="w-full h-full grid place-items-center place-content-center">
					{ members[0] &&
						<AvatarButton
							key={members[0].uuid}
							index={0}
							name={members[0].name ?? "Guest"}
							relation={members[0].relation}
							cornerButton={members[0].isHost ? "host" : ""}
						/>
					}
				</div>
			</main>
			<footer className="
				pointer-events-auto
				flex place-content-between place-items-center
				relative
			">
				<div tabIndex={-1} className="
					z-1
					flex
					gap-[clamp(0.25rem,3vw+0.125rem,2.5rem)]
					sm:overflow-x-visible overflow-x-auto
				">
					{ totalMembers > totalPlayers && 
						members.slice(totalPlayers).map((member, index) => {
							return (
								<AvatarButton
									key={member.uuid}
									index={index}
									name={member.name ?? "Guest"}
									relation={member.relation}
									cornerButton={member.isHost ? "host" : ""}
								/>
							)
						})
					}
					<PartyButton />
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}

const BOT_MEMBERS = [
	{
		uuid: "bot-1",
		name: "Bot-1",
		avatar: "avatar-stock-1.webp",
		badge: "Easy",
		level: 0,
		xp: 0,
		createdAt: "1 July 2026",
		lastLogin: "1 July 2026",
		totalPlayed: 0,
		totalWins: 0,
		totalLoss: 0,
		winStreak: 0,
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
		relation: RELATION.BOT,
		isHost: false,
		seatNumber: 1,
	},
	{
		uuid: "bot-2",
		name: "Bot-2",
		avatar: "avatar-stock-2.webp",
		badge: "Medium",
		level: 0,
		xp: 0,
		createdAt: "1 July 2026",
		lastLogin: "1 July 2026",
		totalPlayed: 0,
		totalWins: 0,
		totalLoss: 0,
		winStreak: 0,
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
		relation: RELATION.BOT,
		isHost: false,
		seatNumber: 2,
	},
	{
		uuid: "bot-3",
		name: "Bot-3",
		avatar: "avatar-stock-3.webp",
		badge: "Hard",
		level: 0,
		xp: 0,
		createdAt: "1 July 2026",
		lastLogin: "1 July 2026",
		totalPlayed: 0,
		totalWins: 0,
		totalLoss: 0,
		winStreak: 0,
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
		relation: RELATION.BOT,
		isHost: false,
		seatNumber: 3,
	},
]
>>>>>>> origin/int/KAN-36-website-db

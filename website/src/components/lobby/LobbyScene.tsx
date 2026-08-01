import { useEffect } from "react";
import { useSceneStore } from "../../store/SceneStore";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore, RELATION } from "../../store/PartyStore";
import { HeaderModule } from "../header/HeaderModule";
import { SmallLogo } from "../logo/SmallLogo";
import { AvatarButton } from "../avatar/AvatarButton";
import { PartyButton } from "../party/PartyButton";

export const LobbyScene = () => {
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
		createdAt: 1784110862000,
		lastLogin: 1784110862000,
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
		createdAt: 1784110862000,
		lastLogin: 1784110862000,
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
		createdAt: 1784110862000,
		lastLogin: 1784110862000,
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
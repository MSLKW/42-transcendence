import { useState, useEffect } from "react";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { HeaderModule } from "../modules/Header";
import { RankButton } from "../components/button/Rank";
import { AvatarButton } from "../components/button/Avatar";
import { SortButtons } from "../components/button/Sort";

export const R3F = () => {
	const { totalPlayers } = useGameStore();
	const { members } = usePartyStore();

	const [activePlayer, setActivePlayer] = useState<number>(0);
	const nextTurn = () => setActivePlayer((prev) => (prev + 1) % 4);
	useEffect(() => {
		const timer = setTimeout(() => {
			nextTurn();
			console.log("activePlayer:", activePlayer);
		}, 1000);
		return () => clearTimeout(timer);
	}, [activePlayer]);

	return (
		<>
			<HeaderModule back="LOBBY" />
			<main>
				{ totalPlayers === 4 &&
					<>
						<div className="absolute left-[25%] top-[5%]">
							<AvatarButton
								key={members[2].uuid}
								uuid={members[2].uuid}
								name={members[2].name ?? "Guest"}
								relation={members[2].relation}
								cornerButton="cardsLeft"
								isActive={false}
							/>
						</div>
						<div className="absolute left-[5%] top-[20%]">
							<AvatarButton
								key={members[1].uuid}
								uuid={members[1].uuid}
								name={members[1].name ?? "Guest"}
								relation={members[1].relation}
								cornerButton="cardsLeft"
								isActive={false}
							/>
						</div>
						<div className="absolute right-[5%] top-[20%]">
							<AvatarButton
								key={members[3].uuid}
								uuid={members[3].uuid}
								name={members[3].name ?? "Guest"}
								relation={members[3].relation}
								cornerButton="cardsLeft"
								isActive={false}
							/>
						</div>
					</>
				}
				{ totalPlayers === 3 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							<AvatarButton
								key={members[1].uuid}
								uuid={members[1].uuid}
								name={members[1].name ?? "Guest"}
								relation={members[1].relation}
								cornerButton="cardsLeft"
								isActive={false}
							/>
						</div>
						<div className="absolute right-[5%] top-[20%]">
							<AvatarButton
								key={members[2].uuid}
								uuid={members[2].uuid}
								name={members[2].name ?? "Guest"}
								relation={members[2].relation}
								cornerButton="cardsLeft"
								isActive={false}
							/>
						</div>
					</>
				}
				{ totalPlayers === 2 &&
					<div className="absolute left-[25%] top-[5%]">
						<AvatarButton
							key={members[1].uuid}
							uuid={members[1].uuid}
							name={members[1].name ?? "Guest"}
							relation={members[1].relation}
							cornerButton="cardsLeft"
							isActive={false}
						/>
					</div>
				}
				<div className="
					absolute left-1/2 top-[32.5%] -translate-x-1/2
				">
					<RankButton />
				</div>
				<div className="
					absolute left-1/2 top-[65%] -translate-x-1/2
					flex gap-[clamp(1.25rem,1.786vw+0.893rem,2.5rem)]
				">
					<button onClick={nextTurn} className="btn-white hw-4/1">PASS</button>
					<button onClick={nextTurn} className="btn-white hw-4/1">PLAY</button>
				</div>
			</main>
			<footer className="flex place-content-between place-items-center">
				<AvatarButton
					key={members[0].uuid}
					uuid={members[0].uuid}
					name={members[0].name ?? "Guest"}
					relation={members[0].relation}
					cornerButton="cardsLeft"
					isActive={true}
				/>
				<div className="
					w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
					flex flex-col place-content-between
					gap-[clamp(0.25rem,2vh+0.125rem,0.75rem)]
				">
					<SortButtons />
				</div>
			</footer>
		</>
	);
}
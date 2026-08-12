import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useSettingsStore, AUTO_PASS_RECORD } from "../../store/SettingsStore";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarButton } from "../avatar/AvatarButton";
import { RankButton } from "./rank/RankButton";
import { SortButtons } from "./sort/SortButton";

export const R3FScene = () => {
	const { totalPlayers } = useGameStore()
	const { members } = usePartyStore();

	const [round, setRound] = useState(1);
	const incRound = () => {
		setRound((r) => r + 1);
	}

	const [cardsLeft, setCardsLeft] = useState<number[]>([]);
	const dealCards = () => {
		const cards = 52 / totalPlayers;
		const newCardsLeft: number[] = [];

		if (totalPlayers === 3) {
			for (let i = 0; i < totalPlayers; i++) {
				if (i === round % totalPlayers)
					newCardsLeft.push(Math.ceil(cards));
				else
					newCardsLeft.push(Math.floor(cards));
			}
		} else {
			for (let i = 0; i < totalPlayers; i++)
				newCardsLeft.push(cards);
		}
		setCardsLeft(newCardsLeft);
	}
	useEffect(() => {
		dealCards();
	}, [totalPlayers, round]);

	const [activePlayer, setActivePlayer] = useState<number>(0);
	const nextTurn = useCallback(() => {
		setActivePlayer((p) => (p + 1) % totalPlayers)
	}, [totalPlayers]);

	const autoPassValues = Object.values(AUTO_PASS_RECORD);
	const { autoPassIndex } = useSettingsStore();
	useEffect(() => {
		const autoPassValue = autoPassValues[autoPassIndex];
		if (autoPassValue <= 0)
			return;
		
		const timer = setTimeout(() => {
			nextTurn();
		}, autoPassValue);
		return () => clearTimeout(timer);
	}, [autoPassIndex, activePlayer, nextTurn]);

	return (
		<>
			<HeaderModule back="LOBBY" />
			<main>
				{ totalPlayers === 4 && members.length >= 4 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ members[1] && members[1].uuid &&
								<AvatarButton
									key={members[1].uuid ?? ""}
									uuid={members[1].uuid ?? ""}
									cornerButton={cardsLeft[1] ?? -1}
									isActive={activePlayer === 1}
								/>
							}
						</div>
						<div className="absolute left-[25%] top-[5%]">
							{ members[2] && members[2].uuid &&
								<AvatarButton
									key={members[2].uuid ?? ""}
									uuid={members[2].uuid ?? ""}
									cornerButton={cardsLeft[2]}
									isActive={activePlayer === 2}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ members[3] && members[3].uuid &&
								<AvatarButton
									key={members[3].uuid ?? ""}
									uuid={members[3].uuid ?? ""}
									cornerButton={cardsLeft[3] ?? -1}
									isActive={activePlayer === 3}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 3 && members.length >= 3 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ members[1] && members[1].uuid &&
								<AvatarButton
									key={members[1].uuid ?? ""}
									uuid={members[1].uuid ?? ""}
									cornerButton={cardsLeft[1] ?? -1}
									isActive={activePlayer === 1}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ members[2] && members[2].uuid &&
								<AvatarButton
									key={members[2].uuid ?? ""}
									uuid={members[2].uuid ?? ""}
									cornerButton={cardsLeft[2] ?? -1}
									isActive={activePlayer === 2}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 2 && members.length >= 2 &&
					<div className="absolute left-[25%] top-[5%]">
						{ members[1] && members[1].uuid &&
							<AvatarButton
								key={members[1].uuid ?? ""}
								uuid={members[1].uuid ?? ""}
								cornerButton={cardsLeft[1] ?? -1}
								isActive={activePlayer === 1}
							/>
						}
					</div>
				}
				<div className="
					absolute left-1/2 top-[32.5%] -translate-x-1/2
				">
					<RankButton />
				</div>
				<div className="
					absolute left-1/2 top-[65%] -translate-x-1/2
					flex gap-2rem
				">
					<button
						onClick={nextTurn}
						disabled={activePlayer != 0}
						className="
							btn-text bg-light
							h-3rem aspect-5/1
						"
					>
						PASS
					</button>
					<button
						onClick={nextTurn}
						disabled={activePlayer != 0}
						className="
							btn-text bg-light
							h-3rem aspect-5/1
						"
					>
						PLAY
					</button>
				</div>
			</main>
			<footer className="flex place-content-between place-items-center">
				{ members[0] && members[0].uuid &&
					<AvatarButton
						key={members[0].uuid}
						uuid={members[0].uuid}
						cornerButton={cardsLeft[0]}
						isActive={activePlayer === 0}
					/>
				}
				<div className="
					w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
					flex flex-col place-content-between
					gap-0.5rem
				">
					<SortButtons />
				</div>
			</footer>
		</>
	);
}
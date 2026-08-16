import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { partySocket } from "../../api/party/partySocket";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSettingsStore, autoPassValues } from "../../store/SettingsStore";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarModule } from "../avatar/AvatarModule";
import { RankCallButton } from "./rank/RankCallButton";
import { SortButtons } from "./sort/SortButton";
import { GamePassButton } from "./action/GamePassButton";
import { GamePlayButton } from "./action/GamePlayButton";

export const GameScene = () => {
	const { addBotToParty } = useBotStore();
	const { totalPlayers, seats, round, cardsLeft, setGameValue, activeSeat, nextTurn } = useGameStore();
	if (!seats)
		return;
	const { members } = usePartyStore();
	const { clientUuid } = useProfileStore();

	const seatIndexes = useMemo(() => {
		const clientIndex = seats.indexOf(clientUuid);
		if (clientIndex === -1)
			return new Array(totalPlayers).fill(null);
		return Array.from({ length: totalPlayers }, (_, i) => {
			return (i + clientIndex) % totalPlayers;
		});
	}, [seats, clientUuid, totalPlayers]);

	const hasRunRef = useRef(false);
	useEffect(() => {
		if (hasRunRef.current)
			return;
		hasRunRef.current = true;

		let i = members.length;
		while (i < totalPlayers) {
			addBotToParty(`bot-${i}`);
			i++;
		}
		partySocket.startGameSession();
		hasRunRef.current = false;
	}, [members.length, totalPlayers]);

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
		setGameValue("cardsLeft", newCardsLeft);
	}
	useEffect(() => {
		dealCards();
	}, [totalPlayers, round]);

	const { autoPassIndex } = useSettingsStore();
	useEffect(() => {
		const autoPassValue = autoPassValues[autoPassIndex];
		if (autoPassValue <= 0)
			return;
		
		const timer = setTimeout(() => {
			nextTurn();
		}, autoPassValue);
		return () => clearTimeout(timer);
	}, [autoPassIndex, activeSeat, nextTurn]);

	return (
		<>
			<HeaderModule back="Home" />
			<main>
				{ totalPlayers === 4 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ seats[seatIndexes[1]] &&
								<AvatarModule
									key={seats[seatIndexes[1]] ?? ""}
									uuid={seats[seatIndexes[1]] ?? ""}
									cornerButton={cardsLeft[seatIndexes[1]] ?? -1}
									isActive={activeSeat === seatIndexes[1]}
								/>
							}
						</div>
						<div className="absolute left-[25%] top-[5%]">
							{ seats[seatIndexes[2]] &&
								<AvatarModule
									key={seats[seatIndexes[2]] ?? ""}
									uuid={seats[seatIndexes[2]] ?? ""}
									cornerButton={cardsLeft[seatIndexes[2]] ?? -1}
									isActive={activeSeat === seatIndexes[2]}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ seats[seatIndexes[3]] &&
								<AvatarModule
									key={seats[seatIndexes[3]] ?? ""}
									uuid={seats[seatIndexes[3]] ?? ""}
									cornerButton={cardsLeft[seatIndexes[3]] ?? -1}
									isActive={activeSeat === seatIndexes[3]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 3 && members.length >= 3 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ seats[seatIndexes[1]] &&
								<AvatarModule
									key={seats[seatIndexes[1]] ?? ""}
									uuid={seats[seatIndexes[1]] ?? ""}
									cornerButton={cardsLeft[seatIndexes[1]] ?? -1}
									isActive={activeSeat === seatIndexes[1]}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ seats[seatIndexes[2]] &&
								<AvatarModule
									key={seats[seatIndexes[2]] ?? ""}
									uuid={seats[seatIndexes[2]] ?? ""}
									cornerButton={cardsLeft[seatIndexes[2]] ?? -1}
									isActive={activeSeat === seatIndexes[2]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 2 && members.length >= 2 &&
					<div className="absolute left-[25%] top-[5%]">
						{ seats[seatIndexes[1]] &&
							<AvatarModule
								key={seats[seatIndexes[1]] ?? ""}
								uuid={seats[seatIndexes[1]] ?? ""}
								cornerButton={cardsLeft[seatIndexes[1]] ?? -1}
								isActive={activeSeat === seatIndexes[1]}
							/>
						}
					</div>
				}
				<div className="
					absolute left-1/2 top-[32.5%] -translate-x-1/2
				">
					<RankCallButton />
				</div>
				<div className="
					absolute left-1/2 top-[65%] -translate-x-1/2
					flex gap-2rem
				">
					<GamePassButton />
					<GamePlayButton />
				</div>
			</main>
			<footer className="flex place-content-between place-items-center">
				{ seats[seatIndexes[0]] &&
					<AvatarModule
						key={seats[seatIndexes[0]]}
						uuid={seats[seatIndexes[0]] ?? ""}
						cornerButton={cardsLeft[seatIndexes[0]]}
						isActive={activeSeat === seatIndexes[0]}
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
import { useState, useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { useSettingsStore, AUTO_PASS_RECORD } from "../store/SettingsStore";
import { HeaderModule } from "../modules/Header";
import { RankButton } from "../components/button/Rank";
import { AvatarButton } from "../components/button/Avatar";
import { SortButtons } from "../components/button/Sort";
import { gameSocket } from "../services/gameSocket";
import { useSceneStore } from "../store/SceneStore";

export const R3F = () => {
	const { totalPlayers, dealCards, cardsLeft } = useGameStore();
	const { members } = usePartyStore();

	const { showNotification } = useNotificationStore();
	useEffect(() => {
		const validateAuth = async () => {
			try {
				const response = await fetch("/api/auth/validate", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					if (response.status === 401)
						throw new Error("Missing or malformed authorization / invalid session");
					else
						throw new Error(errorData.message || "Authentication failed");
				}
			} catch (err) {
				if (err instanceof Error && !err.message.includes("401"))
					showNotification(err.message, notificationType.error);
			}
		};
		validateAuth();
	}, [])

	const { currentScene } = useSceneStore();
	useEffect(() => {
		if (currentScene === "R3F")
			gameSocket.connect();
		else
			gameSocket.disconnect();
		dealCards();

		return () => {
			gameSocket.disconnect();
		};
	}, [currentScene]);

	const [activePlayer, setActivePlayer] = useState<number>(0);
	const nextTurn = () => setActivePlayer((prev) => (prev + 1) % totalPlayers);
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
							<AvatarButton
								key={members[1].uuid ?? ""}
								index={1}
								name={members[1].name ?? "Guest"}
								relation={members[1].relation ?? "-1"}
								cornerButton={cardsLeft[1] ?? -1}
								isActive={activePlayer === 1}
							/>
						</div>
						<div className="absolute left-[25%] top-[5%]">
							<AvatarButton
								key={members[2].uuid ?? ""}
								index={2}
								name={members[2].name ?? "Guest"}
								relation={members[2].relation}
								cornerButton={cardsLeft[2]}
								isActive={activePlayer === 2}
							/>
						</div>
						<div className="absolute right-[5%] top-[20%]">
							<AvatarButton
								key={members[3].uuid ?? ""}
								index={3}
								name={members[3].name ?? "Guest"}
								relation={members[3].relation ?? ""}
								cornerButton={cardsLeft[3] ?? -1}
								isActive={activePlayer === 3}
							/>
						</div>
					</>
				}
				{ totalPlayers === 3 && members.length >= 3 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							<AvatarButton
								key={members[1].uuid ?? ""}
								index={1}
								name={members[1].name ?? "Guest"}
								relation={members[1].relation ?? ""}
								cornerButton={cardsLeft[1] ?? -1}
								isActive={activePlayer === 1}
							/>
						</div>
						<div className="absolute right-[5%] top-[20%]">
							<AvatarButton
								key={members[2].uuid ?? ""}
								index={2}
								name={members[2].name ?? "Guest"}
								relation={members[2].relation ?? ""}
								cornerButton={cardsLeft[2] ?? -1}
								isActive={activePlayer === 2}
							/>
						</div>
					</>
				}
				{ totalPlayers === 2 && members.length >= 2 &&
					<div className="absolute left-[25%] top-[5%]">
						<AvatarButton
							key={members[1].uuid ?? ""}
							index={1}
							name={members[1].name ?? "Guest"}
							relation={members[1].relation ?? ""}
							cornerButton={cardsLeft[1] ?? -1}
							isActive={activePlayer === 1}
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
				<AvatarButton
					key={members[0].uuid}
					index={0}
					name={members[0].name ?? "Guest"}
					relation={members[0].relation}
					cornerButton={cardsLeft[0]}
					isActive={activePlayer === 0}
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
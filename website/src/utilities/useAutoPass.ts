import { useEffect } from "react";
import { useGameStore } from "../store/GameStore";
import { useSettingsStore, autoPassValues } from "../store/SettingsStore";

export const useAutoPass = () => {
	const activeSeat = useGameStore((store) => store.activeSeat);
	const nextTurn = useGameStore((store) => store.nextTurn);
	const gameStarted = useGameStore((store) => store.gameStarted);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);

	useEffect(() => {
		if (!gameStarted)
			return;
		
		const autoPassValue = autoPassValues[autoPassIndex];
		if (autoPassValue <= 0)
			return;

		const timer = setTimeout(() => {
			nextTurn();
		}, autoPassValue);

		return () => clearTimeout(timer);
	}, [autoPassIndex, activeSeat, nextTurn]);
}
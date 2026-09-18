import { useEffect } from "react";
import { gameInstance } from "../../../api/game/src/main";
import { useGameStore } from "../../../store/GameStore";

interface SortButtonProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	type: string;
	sortType: string;
	tip: string;
}

export const SortButton = ({ call, sortType, type, tip }: SortButtonProps) => {
	return (
		<button
			data-tip={tip}
			onClick={call}
			className={`
				btn-text bg-dark
				h-2.5rem
				text-n6 text-1.25rem
				focus:outline-double
				data-tip-left
				${sortType === type ? "outline-2" : "outline-none"}
			`}
		>
			{type}
		</button>
	);
}

export const SortButtons = () => {
	const { sortType } = useGameStore();
	const handleSort = (e: React.MouseEvent<HTMLButtonElement>, selectedType: string) => {
		if (e)
			e.currentTarget.blur();
		gameInstance?.playerRef?.setSort(selectedType);
	}

	useEffect(() => {
		useGameStore.setState({ sortType: "Flex" });
	}, []);
	
	return (
		<>
			<SortButton call={(e) => {handleSort(e, "Rank")}} sortType={sortType} type="Rank" tip="Sort by rank"/>
			<SortButton call={(e) => {handleSort(e, "Suit")}} sortType={sortType} type="Suit" tip="Sort by suit"/>
			<SortButton call={(e) => {handleSort(e, "Flex")}} sortType={sortType} type="Flex" tip="Sort manually"/>
		</>
	);
}
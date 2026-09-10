import { useState } from "react";
import { gameInstance } from "../../../api/game/src/main";

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
	const [sortType, setSortType] = useState("Flex");
	const handleSort = (e: React.MouseEvent<HTMLButtonElement>, selectedType: string) => {
		if (e)
			e.currentTarget.blur();
		if (selectedType === "Rank") {
			gameInstance?.playerRef?.sortCardsByRankButtonHandler();
		}
		else if (selectedType === "Suit") {
			gameInstance?.playerRef?.sortCardsBySuitButtonHandler();
		}
		setSortType(selectedType);
	}
	
	return (
		<>
			<SortButton call={(e) => {handleSort(e, "Rank")}} sortType={sortType} type="Rank" tip="Sort by rank"/>
			<SortButton call={(e) => {handleSort(e, "Suit")}} sortType={sortType} type="Suit" tip="Sort by suit"/>
			<SortButton call={(e) => {handleSort(e, "Flex")}} sortType={sortType} type="Flex" tip="Sort manually"/>
		</>
	);
}
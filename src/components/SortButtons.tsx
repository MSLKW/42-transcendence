import { calculateScaleFactor } from "@react-three/drei";
import { useState } from "react";

interface SortButtonProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	type: string;
	sortType: string;
}

export const SortButton = ({ call, sortType, type }: SortButtonProps) => {
	return (
		<button
			onClick={call}
			className={`btn-sort
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
		setSortType(selectedType);
	}
	
	return (
		<>
			<SortButton call={(e) => {handleSort(e, "Rank")}} sortType={sortType} type="Rank" />
			<SortButton call={(e) => {handleSort(e, "Suit")}} sortType={sortType} type="Suit" />
			<SortButton call={(e) => {handleSort(e, "Flex")}} sortType={sortType} type="Flex" />
		</>
	);
}
import { useState } from "react";

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
				w-full h-full
				bg-n1
				border border-n2 rounded-full
				text-n6 text-[clamp(0.25rem,2vw+0.125rem,1rem)]
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus:outline-2 focus:outline-double
				relative btn-tip-left
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
			<SortButton call={(e) => {handleSort(e, "Rank")}} sortType={sortType} type="Rank" tip="Sort by rank"/>
			<SortButton call={(e) => {handleSort(e, "Suit")}} sortType={sortType} type="Suit" tip="Sort by suit"/>
			<SortButton call={(e) => {handleSort(e, "Flex")}} sortType={sortType} type="Flex" tip="Sort manually"/>
		</>
	);
}
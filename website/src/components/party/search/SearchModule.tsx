import { useRef, useEffect } from "react";
import { SearchButton } from "./SearchButton";

export const SearchModule = () => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<div className="
			w-[90%]
			flex place-content-center place-items-center
			gap-3
		">
			<input
				ref={focusRef}
				id="search"
				type="text"
				placeholder="Search For Party Members"
				className="
					input-chat
				"
			/>
			<SearchButton />
		</div>
	);
}
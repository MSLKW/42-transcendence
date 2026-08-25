import { useRef, useEffect } from "react";
import { SearchButton } from "./SearchButton";

interface SearchModuleProps {
	value: string;
	onChange: (query: string) => void;
}

export const SearchModule = ({ value, onChange }: SearchModuleProps) => {
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
				value={value}
				placeholder="Search For Party Members"
				onChange={(e) => onChange(e.target.value)}
				className="
					input-chat
				"
			/>
			<SearchButton />
		</div>
	);
}
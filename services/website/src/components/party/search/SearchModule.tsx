import { useRef, useEffect } from "react";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { SearchIcon } from "./SearchIcon";

interface SearchModuleProps {
	value: string;
	onChange: (query: string) => void;
	search: () => void;
}

export const SearchModule = ({ value, onChange, search }: SearchModuleProps) => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
			className="
				w-full
				flex place-content-center place-items-center
				gap-1rem
		">
			<input
				ref={focusRef}
				id="search"
				type="text"
				value={value}
				placeholder="Search By Name"
				onChange={(e) => onChange(e.target.value)}
				className="input-chat"
			/>
			<Tooltip text="Search">
				<button
					disabled={value ? false : true}
					className="btn-icon bg-accent"
					onClick={search}
				>
					<SearchIcon />
				</button>
			</Tooltip>
		</form>
	);
}
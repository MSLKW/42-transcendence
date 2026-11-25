import { useState, useRef, useEffect } from "react";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../../utilities/audio/useUiSoundProps";
import { SearchIcon } from "./SearchIcon";
import { playUiSound } from "../../../utilities/audio/uiSounds";

interface SearchModuleProps {
	value: string;
	onChange: (query: string) => void;
}

export const SearchModule = ({ value, onChange }: SearchModuleProps) => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	const suppressNextFocusSoundRef = useRef(true);
	const [query, setQuery] = useState<string | null>(null);

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
				onFocus={() => {
					if (suppressNextFocusSoundRef.current) {
						suppressNextFocusSoundRef.current = false;
						return;
					}
					playUiSound("click");
				}}
				onPointerDown={() => playUiSound("click")}
				onChange={(e) => {
					setQuery(e.target.value);
					onChange(e.target.value);
				}}
				className="input-chat"
			/>
			<Tooltip text="Search">
				<button
					type="button"
					disabled={value ? false : true}
					{...useUiSoundProps()}
					onClick={() => {
						if (query)
							onChange(query);
					}}
					className="btn-icon bg-accent"
				>
					<SearchIcon />
				</button>
			</Tooltip>
		</form>
	);
}
import { useRef, useEffect } from "react";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../../utilities/react/useUiSoundProps";
import { SearchIcon } from "./SearchIcon";
import { playUiSound } from "../../../audio/uiSounds";

interface SearchModuleProps {
	value: string;
	onChange: (query: string) => void;
	search: () => void;
}

export const SearchModule = ({ value, onChange, search }: SearchModuleProps) => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	const suppressNextFocusSoundRef = useRef(true);
	
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
				onChange={(e) => onChange(e.target.value)}
				className="input-chat"
			/>
			<Tooltip text="Search">
				<button
					type="button"
					disabled={value ? false : true}
					{...useUiSoundProps()}
					className="btn-icon bg-accent"
					onClick={search}
				>
					<SearchIcon />
				</button>
			</Tooltip>
		</form>
	);
}
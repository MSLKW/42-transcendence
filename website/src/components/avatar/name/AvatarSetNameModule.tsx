import { useRef, useEffect } from "react";
import { AvatarImage } from "../image/AvatarImage";

interface AvatarSetNameModuleProps {
	name: string;
	avatar: string | undefined;
	uuid: string | undefined;
	setName: (name: string) => void;
	setHasChange?: (change: boolean) => void;
}
export const AvatarSetNameModule = ({ name, avatar, uuid, setName, setHasChange = () => {} }: AvatarSetNameModuleProps) => {
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setHasChange(true);
	}

	const inputRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (!name && inputRef.current)
			inputRef.current.focus();
	}, []);

	return (
		<div className="
			flex place-content-evenly place-items-center
			py-2rem px-1rem
			gap-1rem
		">
			<div className="
				flex flex-col
				place-content-center place-items-center
				gap-1rem
			">
				<AvatarImage uuid={uuid} image={avatar} />
				<input
					ref={inputRef}
					id="name"
					type="text"
					value={name ?? ""}
					placeholder="Name"
					onChange={handleInput}
					onKeyDown={(e) => {
						if (e.key === "Enter")
							e.preventDefault();
						if (e.key === "Enter"|| e.key === "Escape")
							e.currentTarget.blur();
					}}
					minLength={3}
					maxLength={20}
					className="
						bg-n6 h-2.5 w-42.5
						border border-n5 rounded-full
						p-4
						text-n0 text-center
						pointer-events-auto
						focus:outline-2 outline-b5 outline-offset-5
				"/>
			</div>
		</div>
	);
}
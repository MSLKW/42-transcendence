import { useRef, useEffect } from "react";
import { usePlayerStore } from "../store/PlayerStore";
import { AvatarImage } from "../components/image/AvatarImage";

export const AvatarNameModule = () => {
	const { data, setPlayerDataValue } = usePlayerStore();

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (!data.name && focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="
				flex flex-col
				place-content-center place-items-center
				gap-3
			">
				<AvatarImage />
				<input
					ref={focusRef}
					id="name"
					type="text"
					value={data.name ?? ""}
					placeholder="Name"
					onChange={(e)=>{setPlayerDataValue("name", e.target.value)}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === "Escape")
							e.currentTarget.blur();
					}}
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
import { AvatarName } from "../../avatar/name/AvatarName";
import { useBotStore, type INTEL_TYPE } from "../../../store/BotStore";
import { useSceneStore } from "../../../store/SceneStore";

interface BotSetButtonProps {
	name: INTEL_TYPE,
}

export const BotSetButton = ({ name }: BotSetButtonProps) => {
	const { intel, setIntel } = useBotStore();
	const { currentScene } = useSceneStore();
	
	return (
		<div
			className="
				flex flex-col
				place-content-evenly place-items-center
				py-1rem px-2rem
				gap-1rem
			"
		>
			<button
				disabled={currentScene === "Game"}
				onClick={() => setIntel(name)}
				className={`
					w-[clamp(2.5rem,7.5vh+0.5rem,5rem)]
					aspect-square
					bg-a5
					border border-a6 rounded-sm
					${ currentScene === "Game" ? "cursor-default" : "hover:scale-105 cursor-pointer" }
					outline-offset-3 outline-b5
					${name === intel ? "outline-2" : ""}
				`}
			/>
			<AvatarName name={name} />
		</div>
	);
}
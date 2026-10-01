import { AvatarName } from "../../avatar/name/AvatarName";
import { useBotStore, type INTEL_TYPE } from "../../../store/BotStore";
import { useSceneStore } from "../../../store/SceneStore";

interface BotSetButtonProps {
	intel: INTEL_TYPE;
}

export const BotSetButton = ({ intel }: BotSetButtonProps) => {
	const currentIntel = useBotStore((store) => store.currentIntel);
	const currentScene = useSceneStore((store) => store.currentScene);
	
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
				onClick={() => useBotStore.setState({ currentIntel: intel })}
				className={`
					h-6rem aspect-square
					bg-a5
					border border-a6 rounded-sm
					${ currentScene === "Game" ? "cursor-default" : "hover:scale-105 cursor-pointer" }
					outline-b5
					${currentIntel === intel ? "outline-2" : ""}
				`}
			/>
			<AvatarName name={intel} />
		</div>
	);
}
import { AvatarName } from "../../avatar/name/AvatarName";
import { useBotStore, type INTEL_TYPE } from "../../../store/BotStore";

interface BotSetButtonProps {
	name: string,
	intelSelect: INTEL_TYPE,
}

export const BotSetButton = ({ name, intelSelect }: BotSetButtonProps) => {
	const { intel, setIntel } = useBotStore();
	
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
				onClick={() => setIntel(intelSelect)}
				className={`
					w-[clamp(2.5rem,7.5vh+0.5rem,5rem)]
					aspect-square
					bg-a5
					border border-a6 rounded-sm
					hover:scale-105 cursor-pointer
					outline-offset-3 outline-b5
					${intelSelect === intel ? "outline-2" : ""}
				`}
			/>
			<AvatarName name={name} />
		</div>
	);
}
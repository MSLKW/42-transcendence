import { EmoteHover } from "./EmoteHover";
import { EmoteOptions } from "./EmoteOptions";

export const EmoteGroup = () => {
	return (
		<div className="group relative flex">
			<EmoteHover />
			<div
				className="
					bg-dark rounded-full
					h-max w-max
					p-8 pointer-events-auto
					absolute top-full left-1/2 -translate-x-1/2
					invisible opacity-0 group-hover:visible group-hover:opacity-100
					scale-0 group-hover:scale-100 origin-top
					transition-all duration-200 ease-in-out
					grid grid-cols-3 grid-rows-3
				"
			>
				<EmoteOptions emoji="😎" tip="~Cool~" />
				<EmoteOptions emoji="😄" tip="~Happy~" />
				<EmoteOptions emoji="😩" tip="~Weary~" />
				<EmoteOptions emoji="🫡" tip="~Respect~" />
				<EmoteOptions emoji="🥳" tip="~Celebrate~" />
				<EmoteOptions emoji="🤬" tip="~Mad~" />
				<EmoteOptions emoji="☠️" tip="~Dead~" />
				<EmoteOptions emoji="🔥" tip="~Too Hot~" />
				<EmoteOptions emoji="🚑" tip="~Send Help~" />
			</div>
		</div>
	)
}
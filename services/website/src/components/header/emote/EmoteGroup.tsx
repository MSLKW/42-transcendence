import { EmoteHover } from "./EmoteHover";
import { EmoteOptions } from "./EmoteOptions";

export const EmoteGroup = () => {
	return (
		<div className="group relative flex">
			<EmoteHover />
			<div className="
				bg-dark-semi rounded-full
				h-max w-max
				p-8 pointer-events-auto
				absolute top-full left-1/2 -translate-x-1/2
				invisible opacity-0 group-hover:visible group-hover:opacity-100
				scale-0 group-hover:scale-100 origin-top
				transition-all duration-200 ease-in-out
				grid grid-cols-3 grid-rows-3
			">
				<EmoteOptions emoji="😄" tip="Feelin' Good" />
				<EmoteOptions emoji="😎" tip="It's Sunny" />
				<EmoteOptions emoji="🥳" tip="Lets Celebrate" />
				<EmoteOptions emoji="😩" tip="No Luck" />
				<EmoteOptions emoji="🫠" tip="Pass Again?" />
				<EmoteOptions emoji="🤬" tip="Translate This" />
				<EmoteOptions emoji="🔥" tip="Too Hot" />
				<EmoteOptions emoji="🚑" tip="Send Help" />
				<EmoteOptions emoji="🏆" tip="That's Mine" />
			</div>
		</div>
	)
}
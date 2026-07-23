import { useRef } from "react";
import { LightboxButton } from "../components/button/Lightbox";
import { PinButton } from "../components/button/Pin";
import { SendButton } from "../components/button/Send";
import { AvatarImage } from "../components/image/AvatarImage";

export const SearchModule = () => {
	const focusRef = useRef<HTMLInputElement | null>(null);

	return (
		<div className="flex flex-col gap-[clamp(0.125rem,2vw+0.0625rem,0.25rem)]">
			<div className="
				w-full h-max
				flex place-content-center place-items-center
				gap-3
			">
				<input
					ref={focusRef}
					id="party-code"
					type="text"
					placeholder="Search For Party Members"
					className="input-chat"
				/>
				<SendButton />
			</div>
		</div>
	);
}

export const InviteOthersModule = () => {
	return (
		<div className="
			flex
			gap-[clamp(0.125rem,2vw+0.0625rem,0.25rem)]
			text-[clamp(0.5625rem,2.5vw+0.28125rem,1.125rem)]
		">
			<h2>Invitation code:</h2>
			<span className="text-lg tracking-[0.25rem]">
				<i>ABCD1234</i>
			</span>
		</div>
	);
}

export const JoinAnotherPartyModule = () => {
	const focusRef = useRef<HTMLInputElement | null>(null);

	return (
		<div className="w-full flex flex-col gap-[clamp(0.125rem,2vw+0.0625rem,0.25rem)]">
			<label htmlFor="party-code">
				<h2>Join another party</h2>
			</label>
			<div className="
				h-max
				flex place-content-center place-items-center
				gap-3
			">
				<input
					ref={focusRef}
					id="party-code"
					type="text"
					placeholder="Enter code"
					className="input-chat"
				/>
				<SendButton />
			</div>
		</div>
	);
}

export const PinWindowModule = () => {
	return (
		<div className="
			absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2
			z-1
			w-12.5 h-12.5
		">
			<PinButton/>
		</div>
	);
}

interface FriendsProps {
	name: string,
}
export const FriendModule = ({ name }: FriendsProps) => {
	return (
		<div className="flex gap-5">
			<AvatarImage />
			<div className="w-full">
				<h2>{name}</h2>
				<div className="flex place-items-center gap-2 mb-2">
					<div className="h-2.5 aspect-square rounded-full bg-c4"/>
					<span>Online</span>
				</div>
				<button
					className="
						w-full
						rounded-full
						bg-n6
						text-n0
					"
				>
					Invite To Party
				</button>
			</div>
		</div>
	);
}

export const PartyWindow = () => {
	return (
		<section className="
			absolute z-1 top-0 left-0
			h-full w-full
			pointer-events-none
		">
			<LightboxButton dismiss="party" blur={false} isDismissable={true} />
			<div
				className={`
					w-100
					absolute bottom-10 right-10
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-[clamp(0.125rem,2vw+0.0625rem,1.5rem)]
					p-[clamp(0.25rem,2vw+0.125rem,1.875rem)]
					flex flex-col gap-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
					text-n6
					pointer-events-auto
			`}>
				<SearchModule />
				<hr />
				<FriendModule name="Dev-Azrul" />
				<FriendModule name="Dev-Max" />
				<FriendModule name="Dev-Jeremy" />
				<FriendModule name="Dev-Aisyah" />
				<hr />
				<InviteOthersModule />
				<JoinAnotherPartyModule />
				{/* <PinWindowModule /> */}
			</div>
		</section>
	);
}
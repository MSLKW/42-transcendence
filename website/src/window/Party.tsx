import { useRef } from "react";
import { LightboxButton } from "../components/button/Lightbox";
import { PinButton } from "../components/button/Pin";
import { SearchButton } from "../components/button/Search";
import { SendButton } from "../components/button/Send";
import { AvatarImage } from "../components/image/AvatarImage";
import { FriendsIcon } from "../components/icon/Friends";

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
					placeholder="Enter name"
					className="input-chat"
				/>
				<SearchButton />
			</div>
		</div>
	);
}

export const PartyCodeModule = () => {
	return (
		<div className="space-y-1">
			<div
				className="
					flex
					gap-2
					text-[clamp(0.5625rem,2.5vw+0.28125rem,1.125rem)]
					place-items-center
				"
			>
				<h2>Your Party Code:</h2>
				<span className="text-lg tracking-[0.25rem]">
					<i>ABCD1234</i>
				</span>
			</div>
			<div
				className="
					w-full h-max
					flex
					place-content-center place-items-center
					gap-2
				"
			>
				<input
					id="party-code"
					type="text"
					placeholder="Join another party"
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
		<div className="w-full flex gap-5">
			<AvatarImage />
			<div className="w-full">
				<h2>{name}</h2>
				<div className="h-8 flex place-content-between place-items-center">
					<div className="h-full flex place-items-center gap-2">
						<div className="h-2.5 aspect-square rounded-full bg-c4"/>
						<span>Online</span>
					</div>
					<button className="h-8 aspect-square">
						<FriendsIcon />
					</button>
				</div>
				<button
					className="
						w-full
						rounded-full
						bg-n6
						text-n0
						px-5
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
					w-90 max-h-150
					absolute bottom-10 right-10
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-[clamp(0.125rem,2vw+0.0625rem,1.5rem)]
					p-[clamp(0.25rem,2vw+0.125rem,1.875rem)]
					flex flex-col gap-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
					text-n6
					pointer-events-auto
			`}>
				<div className="space-y-1">
					<h2>Search For Party Members</h2>
					<SearchModule />
				</div>
				<hr />
				<div className="space-y-1 overflow-scroll">
					<h2>Friends List</h2>
					<div className="flex flex-col gap-2">
						<FriendModule name="Dev-Azrul" />
						<FriendModule name="Dev-Max" />
						<FriendModule name="Dev-Jeremy" />
						<FriendModule name="Dev-Aisyah" />
					</div>
				</div>
				<hr />
				<PartyCodeModule />
				<PinWindowModule />
			</div>
		</section>
	);
}
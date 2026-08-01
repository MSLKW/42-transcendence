import { useRef, useEffect } from "react";
import { Window } from "../window/Window";
import { SearchButton } from "./search/SearchButton";
import { AvatarButton } from "../avatar/AvatarButton";
import { FriendsIcon } from "./friends/FriendsIcon";
import { usePartyStore } from "../../store/PartyStore";
import { partySocket } from "../../services/partySocket";

export const SearchModule = () => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<div className="
			w-[90%]
			flex place-content-center place-items-center
			gap-3
		">
			<input
				ref={focusRef}
				id="search"
				type="text"
				placeholder="Search For Party Members"
				className="
					input-chat
				"
			/>
			<SearchButton />
		</div>
	);
}

interface FriendsProps {
	name: string,
}
export const FriendModule = ({ name }: FriendsProps) => {
	const { members } = usePartyStore();
	const handleInvite = () => {
		partySocket.sendInvite("12345678-abcd-efgh-ijkl-000000000000");
	}

	return (
		<div
			className="
				h-7rem w-80
				flex place-content-center place-items-center
				gap-0.5rem
			"
		>
			<AvatarButton index={0} name={members[0].name ?? "Guest"} relation={members[0].relation} showName={false}/>
			<button
				data-tip="Send Invite"
				onClick={handleInvite}
				className="
					h-full w-full
					flex flex-col place-content-center place-items-between
					gap-0.5rem
					py-0.5rem px-1rem
					hover:bg-a2
					border border-a3 rounded-sm outline-b5
					hover:scale-105
					cursor-pointer
					data-tip-up
				"
			>
				<div className="flex place-content-between place-items-center">
					<h3>{name}</h3>
					<div
						className="
							h-full
							flex place-content-center place-items-center
							gap-0.5rem
						"
					>
						<div className="h-1rem aspect-square rounded-full bg-c4"/>
						<p>Online</p>
					</div>
				</div>
				<div className="flex place-content-center place-items-center text-a4 gap-0.5rem">
					<FriendsIcon />
					<h3>Invite To Party</h3>
				</div>
			</button>
		</div>
	);
}

export const PartyWindow = () => {
	return (
		<Window
			title="Add To Party"
			dismissKey="party"
			placement="br"
			pinState={false}
		>
			<div
				className={`
					pt-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
					flex flex-col place-content-center place-items-center
					text-n6
					pointer-events-auto
				`}
			>
				<SearchModule />
				<div
					tabIndex={-1}
					className="
						h-full max-h-[40vh]
						pt-6
						space-y-1 px-5
						overflow-scroll
						pb-5
					"
				>
					<h2>Friends List</h2>
					<div className="flex flex-col gap-2">
						<FriendModule name="Dev-Azrul" />
						<FriendModule name="Dev-Max" />
						<FriendModule name="Dev-Jeremy" />
						<FriendModule name="Dev-Aisyah" />
					</div>
				</div>
			</div>
		</Window>
	);
}
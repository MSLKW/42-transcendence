import { Window } from "../window/Window";
import { FriendModule } from "./friends/FriendsModule";
import { SearchModule } from "./search/SearchModule";
import { statusType } from "../player/status/PlayerStatusModule";

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
					flex flex-col place-content-center place-items-center
					text-n6
					py-1.5rem px-0.5rem
					gap-1rem
					pointer-events-auto
				`}
			>
				<div
					tabIndex={-1}
					className="
						h-full max-h-[90%vh]
						py-0.5rem px-1.5rem
						overflow-scroll
						flex flex-col gap-0.75rem
					"
				>
					<h2>Friends List</h2>
					<FriendModule name="Dev-Azrul" status={statusType.online}/>
					<FriendModule name="Dev-Max" status={statusType.online}/>
					<FriendModule name="Dev-Jeremy" status={statusType.unavailable}/>
					<FriendModule name="Dev-Aisyah" status={statusType.offline}/>
				</div>
				<SearchModule />
			</div>
		</Window>
	);
}
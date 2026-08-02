import { Window } from "../window/Window";
import { FriendModule } from "./friends/FriendsModule";
import { SearchModule } from "./search/SearchModule";

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
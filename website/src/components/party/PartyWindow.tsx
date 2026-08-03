import { useState } from "react";
import { Window } from "../window/Window";
import { FriendModule } from "./friends/FriendsModule";
import { SearchModule } from "./search/SearchModule";
import { useCommunityStore } from "../../store/CommunityStore";

export const PartyWindow = () => {
	const { friendsList, publicList } = useCommunityStore();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredResults = searchQuery.trim() === ""
    ? []
    : publicList.filter((player) => {
        const matchesQuery = player.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const isAlreadyFriend = friendsList.some((friend) => friend.uuid === player.uuid);
        return matchesQuery && !isAlreadyFriend;
    });

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
						h-full max-h-[90%vh] w-full
						py-0.5rem px-1.5rem
						overflow-scroll
						flex flex-col gap-0.75rem
					"
				>
					{searchQuery.trim() === "" ? (
						<>
							<h2>Friends List</h2>
							{friendsList.map((player) => (
								<FriendModule
									key={player.uuid}
									name={player.name ?? ""}
									status={player.status}
								/>
							))}
						</>
					) : (
						<>
							<h2>Search Results</h2>
							{filteredResults.length > 0 ? (
								filteredResults.map((player) => (
									<FriendModule
										key={player.uuid}
										name={player.name ?? ""}
										status={player.status}
									/>
								))
							) : (
								<h2>No players found</h2>
							)}
						</>
					)}
				</div>
				<SearchModule 
					value={searchQuery}
					onChange={setSearchQuery}
				/>
			</div>
		</Window>
	);
}
import { useState } from "react";
// import { useFriendStore } from "../../store/FriendStore";
// import { useProfileStore } from "../../store/ProfileStore";
import { Window } from "../window/Window";
// import { FriendModule } from "./friends/FriendsModule";
import { SearchModule } from "./search/SearchModule";

export const PartyWindow = () => {
	// const { } = useFriendStore();
	// const { profilesInDb } = useProfileStore();
	const [searchQuery, setSearchQuery] = useState("");

	// const publicList = profilesInDb.filter(p => p.relation === "STRANGER" || p.relation === "FRIEND" || p.relation === "SELF");
	// const friendsList = profilesInDb.filter(p => p.relation === "FRIEND");

	// const filteredResults = searchQuery.trim() === ""
	// 	? []
	// 	: publicList.filter((profile) => {
	// 		const matchesQuery = profile.name?.toLowerCase().includes(searchQuery.toLowerCase());
	// 		return matchesQuery;
	// 	});


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
						max-h-[50vh] w-full
						py-0.5rem px-1.5rem
						overflow-scroll
						flex flex-col gap-0.75rem
					"
				>
					{searchQuery.trim() === "" ? (
						<>
							<h2>Friends List</h2>
							{/* {friendsList.map((profile) => (
								<FriendModule
									key={profile.uuid!}
									uuid={profile.uuid!}
								/>
							))} */}
						</>
					) : (
						<>
							<h2>Search Results</h2>
							{/* {filteredResults.length > 0 ? (
								filteredResults.map((profile) => (
									<FriendModule
										key={profile.uuid!}
										uuid={profile.uuid!}
									/>
								))
							) : ( */}
								<h2>No players found</h2>
							{/* )} */}
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
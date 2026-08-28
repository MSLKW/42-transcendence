import { useState } from "react";
import { useFriendStore } from "../../store/FriendStore";
import { useProfileStore } from "../../store/ProfileStore";
import { Window } from "../window/Window";
import { SearchModule } from "./search/SearchModule";
import { PartyPlayerModule } from "./player/PartyPlayerModule";

export const PartyWindow = () => {
	const { friends } = useFriendStore();
	const { profilesInDb } = useProfileStore();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredResults = searchQuery.trim() === ""
		? []
		: profilesInDb.filter((profile) => {
			const matchesQuery = profile.name?.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesQuery;
		});


	return (
		<Window
			title="Find Party Members"
			dismissKey="party"
			placement="br"
			pinState={false}
		>
			<div
				className={`
					min-w-90
					flex flex-col place-content-center place-items-center
					text-n6
					py-1.5rem px-0.5rem gap-1rem
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
							{friends.map((f) => (
								<PartyPlayerModule uuid={f}/>
							))}
						</>
					) : (
						<>
							<h2>Search Results</h2>
							{filteredResults.length > 0 ? (
								filteredResults.map((p) => (
									<PartyPlayerModule uuid={p.uuid!}/>
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
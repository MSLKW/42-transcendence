import { useState, useRef, useEffect } from "react";
import { handleGetSearch } from "../../api/profile/get_search/handleGetSearch";
// import { useFriendStore } from "../../store/FriendStore";
import { Window } from "../window/Window";
import { SearchModule } from "./search/SearchModule";
import { PartyPlayerModule } from "./player/PartyPlayerModule";
import { usePartyStore } from "../../store/PartyStore";

export const PartyWindow = () => {
	// const cachedFriends = useFriendStore((store) => store.cachedFriends);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [filteredResults, setFilteredResults] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	
	const searchRequestId = useRef(0);

	const searchFunction = async () => {
		const query = searchQuery.trim();

		if (query === "") {
			setFilteredResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);

		usePartyStore.setState({ availabilityOverrides: {} });

		const controller = new AbortController();
		const requestId = ++searchRequestId.current;

		const timeoutId = setTimeout(async () => {
			try {
				const results = await handleGetSearch(query, controller.signal);

				if (requestId !== searchRequestId.current)
					return;

				setFilteredResults(results);
			} finally {
				if (requestId === searchRequestId.current)
					setIsSearching(false);
			}
		}, 400);

		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		};
	}

	useEffect(() => {
		searchFunction();
	}, [searchQuery]);

	return (
		<Window
			title="Search to add / invite players"
			dismissKey="party"
			placement="bl"
		>
			<div className="
				w-100 max-h-75
				flex flex-col place-content-center place-items-center
				text-n6
				pt-1rem px-1rem gap-0.5rem
				pointer-events-auto
			">
				<div
					tabIndex={-1}
					className="
						max-h-[50vh] w-full
						bg-dark rounded-md
						py-2rem px-1rem
						overflow-y-scroll
						flex flex-col place-content-center place-items-center
						gap-1rem
				">
					{searchQuery.trim() === "" ? (
						<>
							<h3 className="text-n6/50">Friends and search results appear here</h3>
							{/* <h2>Friends List</h2> */}
							{/* {cachedFriends.map((f) => (
								<PartyPlayerModule uuid={f}/>
							))} */}
						</>
					) : (
						<>
							{filteredResults.length > 0 ? (
								filteredResults.map((uuid) => (
									<PartyPlayerModule key={uuid} uuid={uuid} />
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
					search={() => {
						setFilteredResults([]);
						searchFunction();
					}}
				/>
			</div>
			<div className="
				w-full h-2rem
				flex place-content-center place-items-center
				text-n6 opacity-60
			">
				<p>
					{
						isSearching ? "Searching..." :
						searchQuery.trim() !== "" ? (
							filteredResults.length >= 2 ? `${filteredResults.length} players found` :
							filteredResults.length === 1 ? "1 player found" :
							"No players found"
						):
						"0 friends in list"
					}
				</p>
			</div>
		</Window>
	);
}
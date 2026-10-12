import { useState, useRef, useEffect } from "react";
import { handleGetSearch } from "../../api/profile/get_search/handleGetSearch";
// import { useFriendStore } from "../../store/FriendStore";
import { Window } from "../window/Window";
import { SearchModule } from "./search/SearchModule";
import { PartyPlayerModule } from "./player/PartyPlayerModule";

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
			title="Find Players"
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
							{/* {cachedFriends.map((f) => (
								<PartyPlayerModule uuid={f}/>
							))} */}
						</>
					) : (
						<>
							{isSearching && <h2>Searching...</h2>}
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
		</Window>
	);
}
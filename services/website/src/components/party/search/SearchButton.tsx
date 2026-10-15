import { SearchIcon } from "./SearchIcon";

export const SearchButton = () => {
	const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button
			data-tip="Search"
			className="btn-icon bg-accent data-tip-up"
			onClick={(e) => {handleSearch(e)}}
		>
			<SearchIcon />
		</button>
	);
}
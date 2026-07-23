import { usePartyStore } from "../store/PartyStore";

export const PlayerStatsModule = () => {
	const { members, playerFocus } = usePartyStore();

	return (
		<div className="
			flex
			place-content-evenly place-items-end
			divide-x divide-n2
			text-n6
			text-center
		">
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Played</h2>
				<p>{members[playerFocus].totalPlayed}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<p>{members[playerFocus].totalWins}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<p>{members[playerFocus].winStreak}</p>
			</div>
		</div>
	);
}
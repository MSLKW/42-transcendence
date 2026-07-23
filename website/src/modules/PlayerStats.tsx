import { usePartyStore } from "../store/PartyStore";
import { useSceneStore } from "../store/SceneStore";

export const PlayerStatsModule = () => {
	const { members } = usePartyStore();
	const { profileFocus } = useSceneStore();

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
				<p>{members[profileFocus].totalPlayed}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<p>{members[profileFocus].totalWins}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<p>{members[profileFocus].winStreak}</p>
			</div>
		</div>
	);
}
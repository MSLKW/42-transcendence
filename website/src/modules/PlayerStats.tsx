import { usePartyStore } from "../store/PartyStore";
import { useSceneStore } from "../store/SceneStore";

export const PlayerStatsModule = () => {
	const { members } = usePartyStore();
	const { profileIndex } = useSceneStore();

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
				<p>{members[profileIndex].totalPlayed}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<p>{members[profileIndex].totalWins}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<p>{members[profileIndex].winStreak}</p>
			</div>
		</div>
	);
}
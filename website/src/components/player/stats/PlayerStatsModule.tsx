import type { ProfileData } from "../../../store/ProfileStore";

interface PlayerStatsModuleProps {
	profile: ProfileData;
}
export const PlayerStatsModule = ({ profile }: PlayerStatsModuleProps) => {
	return (
		<div className="
			flex
			place-content-evenly place-items-end
			text-n6
			text-center
		">
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Played</h2>
				<h3>{profile.totalPlayed}</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<h3>{profile.totalWins}</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<h3>{profile.winStreak}</h3>
			</div>
		</div>
	);
}
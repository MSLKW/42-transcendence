interface PlayerStatsModuleProps {
	totalPlayed: number,
	totalWins: number,
	winStreak: number,
}

export const PlayerStatsModule = ({ totalPlayed, totalWins, winStreak }: PlayerStatsModuleProps) => {
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
				<h3>{totalPlayed}</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<h3>{totalWins}</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<h3>{winStreak}</h3>
			</div>
		</div>
	);
}
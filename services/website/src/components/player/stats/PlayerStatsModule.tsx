interface PlayerStatsModuleProps {
	uuid: string | null;
}

export const PlayerStatsModule = ({ uuid }: PlayerStatsModuleProps) => {
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
				{/* <h3>{profile ? profile.totalPlayed : "n/a"}</h3> */}
				<h3>n/a</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				{/* <h3>{profile ? profile.totalWins : "n/a"}</h3> */}
				<h3>n/a</h3>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				{/* <h3>{profile ? profile.winStreak : "n/a"}</h3> */}
				<h3>n/a</h3>
			</div>
		</div>
	);
}
import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useResultsStore } from "../../../store/ResultsStore";
import { AvatarModule } from "../../avatar/AvatarModule";

export const ResultsPodiumModule = () => {
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const cachedData = useProfileStore((store) => store.cachedData);
	const results = useResultsStore((store) => store.results);

	return (
		<div
			className="
				flex place-content-evenly
				bg-n0/20 rounded-xl border border-n1/60
				pt-2rem pb-1rem
			"
		>
			{ totalPlayers >= 1 && results[0] &&
				<div className="text-center flex flex-col gap-0.25rem">
					<AvatarModule
						key={results[0].uuid}
						uuid={results[0].uuid}
						image={cachedData[results[0].uuid ?? ""]?.avatar ?? undefined}
						cornerButton="1st"
					/>
					<span className={`${results[0].points > 0 ? "text-r4" : "text-c4"}`}>
						+{results[0].points}
					</span>
				</div>
			}
			{ totalPlayers >= 2 && results[1] &&
				<div className="text-center flex flex-col gap-0.25rem">
					<AvatarModule
						key={results[1].uuid}
						uuid={results[1].uuid}
						image={cachedData[results[1].uuid ?? ""]?.avatar ?? undefined}
						cornerButton="2nd"
					/>
					<span className={`${results[1].points > 0 ? "text-r4" : "text-c4"}`}>
						+{results[1].points}
					</span>
				</div>
			}
			{ totalPlayers >= 3 && results[2] &&
				<div className="text-center flex flex-col gap-0.25rem">
					<AvatarModule
						key={results[2].uuid}
						uuid={results[2].uuid}
						image={cachedData[results[2].uuid ?? ""]?.avatar ?? undefined}
						cornerButton="3rd"
					/>
					<span className={`${results[2].points > 0 ? "text-r4" : "text-c4"}`}>
						+{results[2].points}
					</span>
				</div>
			}
			{ totalPlayers >= 4 && results[3] &&
				<div className="text-center flex flex-col gap-0.25rem">
					<AvatarModule
						key={results[3].uuid}
						uuid={results[3].uuid}
						image={cachedData[results[3].uuid ?? ""]?.avatar ?? undefined}
						cornerButton="4th"
					/>
					<span className={`${results[3].points > 0 ? "text-r4" : "text-c4"}`}>
						+{results[3].points}
					</span>
				</div>
			}
		</div>
	);
}

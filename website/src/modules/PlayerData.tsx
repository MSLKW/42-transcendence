import { useState, useEffect } from "react";
import { usePartyStore } from "../store/PartyStore";
import { useSceneStore } from "../store/SceneStore";
import { BadgeWindow } from "../window/Badge";

export const PlayerDataModule = () => {
	const { members, playerFocus } = usePartyStore();
	const { showWindow, setShowWindow } = useSceneStore();
	const [ xpProgress, setXPProgress ] = useState(0);
	useEffect(() => {
		const percentage = (members[playerFocus].xp / (members[playerFocus].level * 1000)) * 100
		setXPProgress(percentage);
	}, [members[playerFocus].xp]);

	return (
		<div className="
			w-full
			space-y-4
			p-5
			text-n6
		">
			<div className="
				grid grid-cols-[5rem_1fr]
				place-content-start place-items-start
			">
				<label>Level {members[playerFocus].level}</label>
				<div className="text-sm text-center w-full">
					<span>XP: {members[playerFocus].xp} / {members[playerFocus].level * 1000}</span>
					<div className="
						h-2
						rounded-full
						bg-a0
						border border-b5 self-center
						mt-1
					">
						<div 
							style={{ width: `${xpProgress}%` }}
							className="
								bg-b5 
								h-full rounded-full
						"/>
					</div>
				</div>
			</div>
			<div className="
				w-full
				grid grid-cols-1
				place-content-center place-items-center
			">
				<div className="relative w-full flex">
					{ playerFocus === 0
						?
							<button
								type="button"
								onClick={() => setShowWindow("badge", true)}
								className="
									w-full
									bg-n6
									border border-n5 rounded-full
									text-sm
									self-center
							">
								<span className="
									text-n0
									pl-1 pr-3 py-1
									flex justify-between items-center
								">
									<span className="px-3">{members[playerFocus].badge}</span>
									<span className="text-xs">▼</span>
								</span>
							</button>
						:
							<span className="w-full text-center self-center"><i>"{members[playerFocus].badge}"</i></span>
					}
					{ showWindow["badge"] && <BadgeWindow /> }
				</div>
			</div>
			<div>
				<p className="text-sm text-a5">Last Login: {members[playerFocus].lastLogin}</p>
				<p className="text-sm text-a5">Joined: {members[playerFocus].createdAt}</p>
			</div>
		</div>
	);
}
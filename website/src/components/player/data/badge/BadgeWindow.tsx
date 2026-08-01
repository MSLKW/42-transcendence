import { usePlayerStore, BADGE_LABEL } from "../../../../store/PlayerStore";
import { useSceneStore } from "../../../../store/SceneStore";
import { LightboxButton } from "../../../lightbox/LightboxButton";

export const BadgeWindow = () => {
	const { data, setPlayerDataValue } = usePlayerStore();
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<>
			{ showWindow["badge"] && 
				<div className="fixed z-10 left-0 top-0 h-screen w-screen">
					<LightboxButton dismiss="badge" blur={false} />
				</div>
			}
			<ul className="
				absolute z-50
				top-[110%]
				h-fit w-full
				bg-n1
				text-n2
				border border-n2 rounded-md
				flex flex-col place-content-center place-items-center
				p-2
			">
				{BADGE_LABEL.map((badge, index) => {
					const isDisabled = index > data.level;
					return (
						<li key={badge}>
							<button
								type="button"
								disabled={isDisabled}
								onClick={() => {
									setPlayerDataValue("badge", BADGE_LABEL[index]);
									setShowWindow("badge", false);
								}}
								className={`
									w-full
									hover:not-disabled:bg-n2
									rounded-full
									text-sm
									${data.badge === BADGE_LABEL[index] ? "text-b5" : "text-n6"}
									px-3 py-1.5
							`}>
								{badge}
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
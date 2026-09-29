import { useAuthStore } from "../../../../store/AuthStore";
import { useProfileStore, BADGE_LABEL, type BADGE_TYPE } from "../../../../store/ProfileStore";
import { useSceneStore } from "../../../../store/SceneStore";
import { LightboxButton } from "../../../lightbox/LightboxButton";

interface BadgeWindowProps {
	badge: BADGE_TYPE;
	setBadge: (type: BADGE_TYPE) => void;
	setHasChange: (change: boolean) => void;
}

export const BadgeWindow = ({ badge, setBadge, setHasChange }: BadgeWindowProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const getProfileData = useProfileStore((store) => store.getProfileData);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const data = getProfileData(clientUuid!);
	// if (!data)
		// return;

	return (
		<>
			{ showWindow["badge"] && 
				<div className="fixed z-10 left-0 top-0 h-screen w-screen">
					<LightboxButton dismiss="badge" blur={false} />
				</div>
			}
			<ul className="
				absolute z-50 top-[110%] w-full
				bg-dark rounded-md
				text-n2
				flex flex-col place-content-center place-items-center
				py-0.5rem
			">
				{BADGE_LABEL.map((badge_label, index) => {
					// const isDisabled = index > data.level;
					const isDisabled = index > 1;
					return (
						<li key={badge_label}>
							<button
								type="button"
								disabled={isDisabled}
								onClick={() => {
									console.log("[Badge Window] badge_label:", badge_label);
									setBadge(badge_label);
									setShowWindow("badge", false);
									setHasChange(true);
								}}
								className={`
									w-full
									hover:not-disabled:bg-n2
									rounded-full
									text-sm
									${badge === BADGE_LABEL[index] ? "text-b5" : "text-n6"}
									py-0.5rem px-2rem
									${isDisabled ? "cursor-default" : "cursor-pointer"}
							`}>
								{badge_label}
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
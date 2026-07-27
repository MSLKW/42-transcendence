import { useSceneStore } from "../../store/SceneStore";
import { RELATION, type RelationType } from "../../store/PartyStore";
import { AvatarImage } from "../image/AvatarImage";
import { AvatarName } from "../label/AvatarName";
import { HostIcon } from "../icon/Host";

interface AvatarProps {
	index: number,
	name: string,
	relation: RelationType,
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
	showName?: boolean;
}

export const AvatarButton = ({ index, name, relation, cornerButton = "", isActive = false, showName = true }: AvatarProps) => {
	const { setSceneValue, setShowWindow } = useSceneStore();

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button
				data-tip={
					relation === RELATION.SELF ? "Edit Profile" :
					relation === RELATION.BOT ? "Choose Bot"
					: "View Stats"
				}
				onClick={(e) => {
					e.currentTarget.blur();

					setSceneValue("profileIndex", index);
					if (relation === RELATION.SELF)
						setShowWindow("profile", true);
					else if (relation === RELATION.BOT)
						setShowWindow("bots", true);
					else
						setShowWindow("stats", true);
				}}
				className={`
					rounded-xs
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-2 outline-b5
					${ cornerButton ? "data-tip-up2" : "data-tip-up" }
					cursor-pointer
					relative
				`}
			>
				<AvatarImage isActive={isActive} />
				{ cornerButton === "host" &&
					<div
						data-tip="Host"
						className="
							bg-dark rounded-full
							h-3rem aspect-square
							data-tip-down
							absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
							text-a4
							cursor-help
						"
					>
						<HostIcon />
					</div>
				}
				{ cornerButton === "cardsLeft" &&
					<div
						data-tip="Cards Left"
						className="
							bg-dark rounded-full
							h-3rem aspect-square
							absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
							text-n6
							flex place-content-center place-items-center
							data-tip-down
							cursor-help
						"
					>
						<p>13</p>
					</div>
				}
				{ (cornerButton === "1st" || cornerButton === "2nd" || cornerButton === "3rd" || cornerButton === "4th") &&
					<div
						data-tip={cornerButton + " Place"}
						className={`
							absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
							${cornerButton === "1st" ? "bg-accent text-n0" : "bg-dark text-n6" }
							h-3rem aspect-square
							rounded-full
							text-n0
							flex place-content-center place-items-center
							cursor-help
							data-tip-down
						`}
					>
						<p>{cornerButton}</p>
					</div>
				}
			</button>
			{ showName && <AvatarName name={name} /> }
		</div>
	);
}
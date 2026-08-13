import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "./AvatarImage";
import { AvatarName } from "./AvatarNameLabel";
import { HostIcon } from "./HostIcon";

interface AvatarProps {
	uuid: string,
	cornerButton?: string | number;
	isActive?: boolean;
	showName?: boolean;
}

export const AvatarButton = ({
	uuid,
	cornerButton = "",
	isActive = false,
	showName = true,
}: AvatarProps) => {
	const { getMemberData } = usePartyStore();
	const { currentScene, setShowWindow, setSceneValue } = useSceneStore();

	const data = getMemberData(uuid);
	if (!data)
		return null;

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button
				data-tip={
					data.relation === "Self" && currentScene !== "GAMEPLAY" ? "Edit Profile" :
					(data.relation === "Bot" && currentScene === "LOBBY") ? "Choose Bot" :
					(data.relation === "Stranger" || data.relation === "Friend") ? "View Stats" :
					""
				}
				onClick={(e) => {
					e.currentTarget.blur();

					if (data.relation === "Self" && currentScene !== "GAMEPLAY") {
						setShowWindow("profile", true);
						console.log("Edit Profile button clicked");
					} else if (data.relation === "Bot" && currentScene === "LOBBY") {
						setShowWindow("bots", true);
						console.log("Bots Profile button clicked");
					} else if (data.relation === "Stranger" || data.relation === "Friend") {
						setSceneValue("profileUuid", uuid);
						setShowWindow("stats", true, uuid);
						console.log("Player Profile button clicked");
					}
				}}
				className={`
					rounded-xs
					${ (data.relation === "Bot" || data.relation === "Self") && currentScene === "GAMEPLAY"
						? ""
						: "hover:not-disabled:scale-105 active:hover:not-disabled:scale-100 focus-visible:outline-2 cursor-pointer"
					}
					${ (data.relation === "Bot" || data.relation === "Self") && currentScene === "GAMEPLAY"
						? ""
						: cornerButton ? "data-tip-up2" : "data-tip-up"
					}
					outline-b5
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
				{ typeof cornerButton === "number" &&
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
						<p>{cornerButton}</p>
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
			{ showName && data.name && <AvatarName name={data.name} /> }
		</div>
	);
}
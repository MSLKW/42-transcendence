import { useEffect } from "react";
import { useBotStore } from "../../store/BotStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { HeaderModule } from "../header/HeaderModule";
import { HomeCardButton } from "./home_card/HomeCard";
import { AvatarButton } from "../avatar/AvatarButton";
import { PartyButton } from "../party/invite/InviteButton";
import { SmallLogo } from "../logo/SmallLogo";

export const HomeScene = () => {
	const { hostUuid, members } = usePartyStore();
	const { clientUuid } = useProfileStore();
	const { removeBotsFromParty } = useBotStore();

	useEffect(() => {
		console.log("[Home] Client Uuid:", clientUuid, " hostUuid:", hostUuid);
		removeBotsFromParty();
	}, [])

	return (
		<>
			<HeaderModule back="LOGIN" />
			<main>
				<div
					tabIndex={-1}
					className="
						absolute top-0 left-0
						w-full h-full
						pt-[clamp(5rem,25vh,20rem)] pb-[clamp(10rem,32vh,20rem)]
						flex
						overflow-x-auto
						snap-x snap-mandatory
					"
				>
					<div className="
						flex place-content-center-safe place-items-center gap-2rem
						w-full h-full
						flex-5
						pointer-events-auto
					">
						<HomeCardButton gameMode="4 Players" totalPlayers={4}/>
						<HomeCardButton gameMode="3 Players" totalPlayers={3}/>
						<HomeCardButton gameMode="2 Players" totalPlayers={2}/>
						<HomeCardButton gameMode="Tutorial" totalPlayers={1}/>
					</div>
				</div>
			</main>
			<footer className="
				pointer-events-auto
				flex place-content-between place-items-center
				relative
			">
				<div
					tabIndex={-1}
					className="
						z-1
						flex
						gap-2rem
						sm:overflow-x-visible overflow-x-auto
						pt-5
					"
				>
					{clientUuid &&
						<AvatarButton 
							key={clientUuid}
							uuid={clientUuid}
							cornerButton={hostUuid === clientUuid ? "host" : ""}
						/>
					}
					{ members.map((member) => (
						member.uuid != clientUuid &&
						<AvatarButton
							key={member.uuid}
							uuid={member.uuid!}
							cornerButton={hostUuid === member.uuid ? "host" : ""}
						/>
					))}
					<PartyButton />
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}
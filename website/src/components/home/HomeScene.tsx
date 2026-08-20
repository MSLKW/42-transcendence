import { useEffect } from "react";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { HeaderModule } from "../header/HeaderModule";
import { HomeCardButton } from "./home_card/HomeCard";
import { AvatarModule } from "../avatar/AvatarModule";
import { PartyCallButton } from "../party/call/PartyCallButton";
import { SmallLogo } from "./logo/SmallLogo";

export const HomeScene = () => {
	const { removeBots } = useBotStore();
	const { setGameValue, initSeats } = useGameStore();
	const { hostUuid, members, set1PlayerParty } = usePartyStore();
	const { clientUuid } = useProfileStore();
	
	useEffect(() => {
		removeBots();
		if (members.length <= 0)
			set1PlayerParty();
		setGameValue("totalPlayers", 0);
		initSeats();
	}, [])

	return (
		<>
			<HeaderModule back="Login" />
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
						<HomeCardButton gameMode="4 Players" playerCount={4}/>
						<HomeCardButton gameMode="3 Players" playerCount={3}/>
						<HomeCardButton gameMode="2 Players" playerCount={2}/>
						<HomeCardButton gameMode="Tutorial" playerCount={1}/>
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
						w-full
						flex
						gap-0.5rem pt-2rem
						sm:overflow-x-visible overflow-x-auto
					"
				>
					{clientUuid &&
						<AvatarModule 
							key={clientUuid}
							uuid={clientUuid}
							cornerButton={hostUuid === clientUuid ? "host" : ""}
						/>
					}
					{ members.map((member) => (
						member.uuid && member.uuid != clientUuid &&
							<AvatarModule
								key={member.uuid}
								uuid={member.uuid}
								cornerButton={hostUuid === member.uuid ? "host" : ""}
							/>
					))}
					<PartyCallButton />
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}
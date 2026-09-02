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
	const { initSeats } = useGameStore();
	const { hostUuid, members } = usePartyStore();
	const { clientUuid, setCachedData, getCachedData } = useProfileStore();
	const data = getCachedData(clientUuid);
	
	useEffect(() => {
		removeBots();
		if (members.length <= 0) {
			setCachedData();
			usePartyStore.setState({
				members: [ clientUuid ],
				hostUuid: clientUuid,
			});
		}
		useGameStore.setState({ totalPlayers: 0 });
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
						flex pt-[clamp(5rem,25vh,20rem)] pb-[clamp(10rem,32vh,20rem)]
						overflow-x-auto snap-x snap-mandatory
					"
				>
					<div className="
						w-full h-full
						flex place-content-center-safe place-items-center
						gap-4rem
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
						gap-2rem pt-2rem
						sm:overflow-x-visible overflow-x-auto
					"
				>
					<PartyCallButton />
					{clientUuid &&
						<AvatarModule 
							key={clientUuid}
							uuid={clientUuid}
							image={data?.avatar ?? "avatar-unknown.webp"}
							cornerButton={hostUuid === clientUuid ? "host" : ""}
						/>
					}
					{ members.map((uuid) => (
						uuid && uuid != clientUuid &&
							<AvatarModule
								key={uuid}
								uuid={uuid}
								image={getCachedData(uuid)?.avatar ?? "avatar-unknown.webp"}
								cornerButton={hostUuid === uuid ? "host" : ""}
							/>
					))}
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}
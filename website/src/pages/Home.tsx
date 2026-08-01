import { useEffect } from "react";
import { usePartyStore, GAMEMODE } from "../store/PartyStore";
import { HeaderModule } from "../components/header/HeaderModule";
import { HomeCardButton } from "../components/home_card/HomeCard";
import { AvatarButton } from "../components/button/Avatar";
import { PartyButton } from "../components/button/Party";
import { SmallLogo } from "../components/logo/SmallLogo";

export const Home = () => {
	const { members, removeBots } = usePartyStore();

	useEffect(() => {
		removeBots();
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
						flex place-content-center-safe place-items-center gap-[clamp(1.25rem,1.786vw+0.893rem,2.5rem)]
						w-full h-full
						flex-5
						pointer-events-auto
					">
						<HomeCardButton gameMode={GAMEMODE.VERSUS4}/>
						<HomeCardButton gameMode={GAMEMODE.VERSUS3}/>
						<HomeCardButton gameMode={GAMEMODE.VERSUS2}/>
						<HomeCardButton gameMode={GAMEMODE.TUTORIAL}/>
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
						gap-[clamp(0.25rem,3vw+0.125rem,2.5rem)]
						sm:overflow-x-visible overflow-x-auto
					"
				>
					{ members.map((member, index) => (
						<AvatarButton
							key={member.uuid}
							index={index}
							name={member.name ?? "Guest"}
							relation={member.relation}
							cornerButton={member.isHost ? "host" : ""}
						/>
					))}
					<PartyButton />
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}
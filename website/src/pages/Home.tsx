import { usePartyStore } from "../store/PartyStore";
import { HomeCardButton } from "../components/button/HomeCard";
import { InfoButton } from "../components/button/Info";
import { SignOutButton } from "../components/button/SignOut";
import { SettingsButton } from "../components/button/Settings";
import { AvatarButton } from "../components/button/Avatar";
import { ChatButton } from "../components/button/Chat";
import { PartyButton } from "../components/button/Party";
import { EmojiButton } from "../components/button/Emoji";
import { SmallLogo } from "../components/label/Logo";

export const GAMEMODE = {
	DEV: 1,
	PLAYERS2: 2,
	PLAYERS3: 3,
	PLAYERS4: 4,
}

export const Home = () => {
	const { partyCount, members } = usePartyStore();

	return (
		<>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex bg-n1 border border-n2 rounded-3xl">
	 					<SignOutButton />
	 					<SettingsButton />
						<InfoButton />
	 				</div>
	 				<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
				<main>
					<div tabIndex={-1} className="
						absolute top-0 left-0
						w-full h-full
						pt-[clamp(5rem,25vh,20rem)] pb-[clamp(10rem,32vh,20rem)]
		 				flex
		 				overflow-x-auto
		 				snap-x snap-mandatory
		 			">
		 				<div className="
		 					flex place-content-center-safe place-items-center gap-[clamp(1.25rem,1.786vw+0.893rem,2.5rem)]
							w-full h-full
							flex-5
							pointer-events-auto
		 				">
		 					<HomeCardButton gameMode={GAMEMODE.PLAYERS4}/>
		 					<HomeCardButton gameMode={GAMEMODE.PLAYERS3}/>
		 					<HomeCardButton gameMode={GAMEMODE.PLAYERS2}/>
		 					<HomeCardButton gameMode={GAMEMODE.DEV}/>
		 				</div>
		 			</div>
				</main>
				<footer className="
					pointer-events-auto
					flex place-content-between place-items-center
					relative
				">
					<div tabIndex={-1} className="
						z-1
						flex
						gap-[clamp(0.25rem,3vw+0.125rem,2.5rem)]
						sm:overflow-x-visible overflow-x-auto
					">
						{ Array.from({ length: partyCount }).map((_, index) => (
							<AvatarButton key={index} playerIndex={index} cornerButton={members[index].isHost === true ? "host" : "remove"}/>
						))}
						<PartyButton />
					</div>
					<SmallLogo />
				</footer>
			</section>
		</>
	);
}
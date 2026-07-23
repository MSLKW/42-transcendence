import { useGameStore } from "../store/GameStore";
import { useSceneStore } from "../store/SceneStore";
import { BackButton } from "../components/button/Back";
import { SettingsButton } from "../components/button/Settings";
import { EmojiButton } from "../components/button/Emoji";
import { ChatButton } from "../components/button/Chat";
import { NextGameButton } from "../components/button/NextGame";
import { AvatarButton } from "../components/button/Avatar";
import { AvatarImage } from "../components/image/AvatarImage";
import { RedTriangle } from "../components/image/RedTriangle";
import { GreenTriangle } from "../components/image/GreenTriangle";

export const ResultRank = () => {
	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>Rank</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2
			">
				<h2>1</h2>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>2</h2>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>3</h2>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>4</h2>
			</div>
		</>
	);
}

export const ResultPlayed = () => {
	const { playerOrder } = useGameStore();

	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>Rounds Played: 2</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-items-center
				gap-5
				h-full w-full
				bg-b2
			">
				<AvatarImage />
				<h2>{playerOrder[0]}</h2>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<h2>{playerOrder[1]}</h2>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<h2>{playerOrder[3]}</h2>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<h2>{playerOrder[2]}</h2>
			</div>
		</>
	);
}

export const ResultChange = () => {
	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>Change</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2
			">
				<GreenTriangle />
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<GreenTriangle />
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
				<RedTriangle />
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
				<RedTriangle />
			</div>
		</>
	);
}

export const ResultTotal = () => {
	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>Total</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2
			">
				<h2>5</h2>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>10</h2>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>12</h2>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
				<h2>15</h2>
			</div>
		</>
	);
}

export const ResultsWindow = () => {
	return (
		<div className="
			bg-n1
			border border-n2 rounded-[clamp(0.25rem,3vw+0.125rem,1.5rem)]
			relative
		">
			<div className="
				flex place-content-evenly
				border-b border-n2
				pt-10 pb-3
			">
				<div className="text-center flex flex-col gap-3">
					<AvatarButton playerIndex={0} cornerButton="1st"/>
					<span className="text-b5">+0</span>
				</div>
				<div className="text-center flex flex-col gap-3">
					<AvatarButton playerIndex={1} cornerButton="2nd" />
					<span className="text-r4">+6</span>
				</div>
				<div className="text-center flex flex-col gap-3">
					<AvatarButton playerIndex={3} cornerButton="3rd" />
					<span className="text-r4">+8</span>
				</div>
				<div className="text-center flex flex-col gap-3">
					<AvatarButton playerIndex={2} cornerButton="4th" />
					<span className="text-r4">+15</span>
				</div>
			</div>
			<div className="
				grid grid-cols-[7.5rem_15rem_7.5rem_7.5rem] grid-rows-[5rem_5rem_5rem_5rem_5rem]
				text-center text-n6
				divide-x divide-n2
			">
				<ResultRank />
				<ResultPlayed />
				<ResultChange />
				<ResultTotal />
			</div>
			<div className="
				absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
				z-1
			">
				<NextGameButton />
			</div>
		</div>
	);
}

export const Results = () => {
	const { setCurrentScene } = useSceneStore();

	return (
		<>
			<header className="flex place-content-between">
				<div className="flex btn-icon-border">
					<BackButton scene={() => setCurrentScene("LOBBY")} />
					<SettingsButton />
				</div>
				<div className="flex btn-icon-border">
					<EmojiButton />
					<ChatButton />
				</div>
			</header>
			<main className="flex place-content-center place-items-center p-[clamp(0.5rem,4vh+0.25rem,2.5rem)]">
				<ResultsWindow />
			</main>
			<footer />
		</>
	);
}
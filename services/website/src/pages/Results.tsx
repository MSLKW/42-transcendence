<<<<<<< HEAD
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton } from "../components/Settings";
import { EmojiButton } from "../components/EmojiButtons";
import { ChatButton } from "../components/Chat";
import { NextGameButton } from "../components/NextGameButton";
import { AvatarImage, AvatarButton } from "../components/Avatar";
import { useGameStore } from "../store/useGameStore";

export const ResultRank = () => {
=======
import { useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { usePartyStore } from "../store/PartyStore";
import { HeaderModule } from "../modules/Header";
import { AvatarButton } from "../components/button/Avatar";
import { AvatarImage } from "../components/image/AvatarImage";
import { RedTriangle } from "../components/image/RedTriangle";
import { GreenTriangle } from "../components/image/GreenTriangle";
import { useGameStore } from "../store/GameStore";

const ResultRank = () => {
>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
				<h2>1</h2>
=======
				<h3>1</h3>
>>>>>>> origin/int/KAN-36-website-db
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
<<<<<<< HEAD
				<h2>2</h2>
			</div>
			<div className="
=======
				<h3>2</h3>
			</div>
			{/* <div className="
>>>>>>> origin/int/KAN-36-website-db
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
<<<<<<< HEAD
				<h2>3</h2>
=======
				<h3>3</h3>
>>>>>>> origin/int/KAN-36-website-db
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
<<<<<<< HEAD
				<h2>4</h2>
			</div>
=======
				<h3>4</h3>
			</div> */}
>>>>>>> origin/int/KAN-36-website-db
		</>
	);
}

<<<<<<< HEAD
export const ResultPlayed = () => {
	const playerList = useGameStore((store) => store.playerList);
=======
const ResultPlayed = () => {
	const { members } = usePartyStore();
	const { totalPlayers } = useGameStore();

>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
				<h2>{playerList[0]}</h2>
=======
				<div className="flex flex-col place-content-center place-items-start">
					<h3>{members[0].name}</h3>
					<p>Total Wins: 1</p>
				</div>
>>>>>>> origin/int/KAN-36-website-db
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
<<<<<<< HEAD
				<h2>{playerList[1]}</h2>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<h2>{playerList[3]}</h2>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<h2>{playerList[2]}</h2>
			</div>
=======
				<div className="flex flex-col place-content-center place-items-start">
					<h3>{members[1].name}</h3>
					<p>Total Wins: 1</p>
				</div>
			</div>
			{/* { totalPlayers <= 3 &&
				<div className="
					row-start-4 row-end-4
					flex place-items-center
					gap-5
					h-full w-full
				">
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{members[2].name}</h3>
						<p>Total Wins: 0</p>
					</div>
				</div>
			}
			{ totalPlayers <= 4 &&
				<div className="
					row-start-5 row-end-5
					flex place-items-center
					gap-5
					h-full w-full
				">
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{members[3].name}</h3>
						<p>Total Wins: 0</p>
					</div>
				</div>
			} */}
>>>>>>> origin/int/KAN-36-website-db
		</>
	);
}

<<<<<<< HEAD
const GreenTriangle = () => {
  return (
    <div className="
		w-0 h-0
		border-l-[8px] border-l-transparent
		border-r-[8px] border-r-transparent
		border-b-[12px] border-c4"
    />
  );
};

const RedTriangle = () => {
  return (
    <div className="
		w-0 h-0
		border-l-[8px] border-l-transparent
		border-r-[8px] border-r-transparent
		border-t-[12px] border-r4"
    />
  );
};

export const ResultChange = () => {
=======
const ResultChange = () => {
	const { totalPlayers } = useGameStore();
	
>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
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
=======
			{/* { totalPlayers <= 3 &&
				<div className="
					row-start-4 row-end-4
					flex place-content-center place-items-center
					h-full w-full
				">
					<RedTriangle />
				</div>
			}
			{ totalPlayers <= 4 &&
				<div className="
					row-start-5 row-end-5
					flex place-content-center place-items-center
					h-full w-full
				">
					<RedTriangle />
				</div>
			} */}
>>>>>>> origin/int/KAN-36-website-db
		</>
	);
}

<<<<<<< HEAD
export const ResultTotal = () => {
=======
const ResultTotal = () => {
	const { totalPlayers } = useGameStore();

>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
				<h2>5</h2>
=======
				<h3>5</h3>
>>>>>>> origin/int/KAN-36-website-db
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
<<<<<<< HEAD
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
=======
				<h3>10</h3>
			</div>
			{/* { totalPlayers <= 3 &&
				<div className="
					row-start-4 row-end-4
					flex place-content-center place-items-center
					h-full w-full
				">
					<h3>12</h3>
				</div>
			}
			{ totalPlayers <= 4 &&
				<div className="
					row-start-5 row-end-5
					flex place-content-center place-items-center
					h-full w-full
				">
					<h3>15</h3>
				</div>
			} */}
>>>>>>> origin/int/KAN-36-website-db
		</>
	);
}

<<<<<<< HEAD

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
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);

	useEffect(() => {
		if (!containerRef.current)
			return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setContAreaWidth(entry.target.scrollWidth);
				setContAreaHeight(entry.target.scrollHeight);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
=======
export const Results = () => {
	const { totalPlayers } = useGameStore();
	const { members } = usePartyStore();
	const { setNotification } = useNotificationStore();
	const winner = "Congratulations " + members[0].name + "! Play next round?";
	useEffect(() => {
		setNotification(winner, notificationType.nextRound);
>>>>>>> origin/int/KAN-36-website-db
	}, []);

	return (
		<>
<<<<<<< HEAD
			<section ref={containerRef} className="cont-canvas">
				<Canvas>
					{showStats && <Stats />}
					<AdaptiveDpr />
					<ambientLight intensity={0.5}/>
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
			</section>
			<section className="cont-body backdrop-blur-xs">
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
			</section>
=======
			<HeaderModule back="LOBBY" />
			<main
				className="
					flex place-content-center place-items-center
					py-2rem px-3rem
					translate-y-10
				"
			>
				<div
					className="
						bg-dark
						rounded-xl
					"
				>
					<div
						className="
							flex place-content-evenly
							border-b border-n2
							pt-10 pb-3
						"
					>
						<div className="text-center flex flex-col gap-3">
							<AvatarButton index={0} name={members[0].name ?? "Guest"} relation={members[0].relation} cornerButton="1st"/>
							<span className="text-b5">+0</span>
						</div>
						<div className="text-center flex flex-col gap-3">
							<AvatarButton index={1} name={members[1].name ?? "Guest"} relation={members[1].relation} cornerButton="2nd" />
							<span className="text-r4">+6</span>
						</div>
						{/* { totalPlayers <= 3 &&
							<div className="text-center flex flex-col gap-3">
								<AvatarButton index={2} name={members[2].name ?? "Guest"} relation={members[2].relation} cornerButton="3rd" />
								<span className="text-r4">+8</span>
							</div>
						}
						{ totalPlayers <= 4 &&
							<div className="text-center flex flex-col gap-3">
								<AvatarButton index={3} name={members[3].name ?? "Guest"} relation={members[3].relation} cornerButton="4th" />
								<span className="text-r4">+15</span>
							</div>
						} */}
					</div>
					<div
						className="
							grid grid-cols-[7.5rem_15rem_7.5rem_7.5rem] grid-rows-[5rem]
							text-center text-n6
							divide-x divide-n2
						"
					>
						<ResultRank />
						<ResultPlayed />
						<ResultChange />
						<ResultTotal />
					</div>
				</div>
			</main>
>>>>>>> origin/int/KAN-36-website-db
		</>
	);
}
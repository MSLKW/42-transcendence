import { useRef, useEffect } from "react";
import { usePlayerStore } from "../store/PlayerStore";
import { useSceneStore } from "../store/SceneStore";
import { BadgeWindow } from "./Badge";
import { CloseModule } from "../modules/Close";
import { MedalsModule } from "../modules/Medals";
import { AvatarSelectButton } from "../components/button/AvatarSelect";
import { LightboxButton } from "../components/button/Lightbox";
import { AvatarImage } from "../components/image/AvatarImage";

export const AvatarNameModule = () => {
	const { data, setPlayerDataValue } = usePlayerStore();

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (!data.name && focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="flex flex-col gap-3 place-content-center place-items-center">
				<AvatarImage />
				<input
					ref={focusRef}
					id="name"
					type="text"
					value={data.name ?? ""}
					placeholder="Name"
					onChange={(e)=>{setPlayerDataValue("name", e.target.value)}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === "Escape")
							e.currentTarget.blur();
					}}
					className="
						bg-n6 h-2.5 w-42.5
						border border-n5 rounded-full
						p-4
						text-n0 text-center
						pointer-events-auto
						focus:outline-2 outline-b5 outline-offset-5
				"/>
			</div>
		</div>
	);
}

export const AvatarSelectModule = () => {
	return (
		<div className="
			grid grid-rows-3 grid-cols-4
			place-content-center place-items-center
			gap-5
			p-5
		">
			<AvatarSelectButton id="avatar-stock-0.webp" color="bg-a4"/>
			<AvatarSelectButton id="avatar-stock-1.webp" color="bg-b4"/>
			<AvatarSelectButton id="avatar-stock-2.webp" color="bg-c4"/>
			<AvatarSelectButton id="avatar-stock-3.webp" color="bg-d4"/>
			<AvatarSelectButton id="avatar-stock-4.webp" color="bg-r4"/>
			<AvatarSelectButton id="avatar-stock-5.webp" color="bg-a4"/>
			<AvatarSelectButton id="avatar-stock-6.webp" color="bg-b4"/>
			<AvatarSelectButton id="avatar-stock-7.webp" color="bg-c4"/>
			<AvatarSelectButton id="avatar-stock-8.webp" color="bg-d4"/>
			<AvatarSelectButton id="avatar-stock-9.webp" color="bg-r4"/>
			<AvatarSelectButton id="avatar-stock-10.webp" color="bg-a4"/>
			<AvatarSelectButton id="avatar-stock-11.webp" color="bg-b4"/>
		</div>
	);
}

export const PlayerStatsModule = () => {
	const { data } = usePlayerStore();

	return (
		<div className="
			flex
			place-content-evenly place-items-end
			divide-x divide-n2
			text-n6
			text-center
		">
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Played</h2>
				<p>{data.totalPlayed}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Total Wins</h2>
				<p>{data.totalWins}</p>
			</div>
			<div className="
				w-full h-full
				p-5
			">
				<h2>Win Streak</h2>
				<p>{data.winStreak}</p>
			</div>
		</div>
	);
}

export const PlayerDataModule = () => {
	const { data } = usePlayerStore();
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<div className="
			w-full
			space-y-4
			p-5
			text-n6
		">
			<div className="
				grid grid-cols-[5rem_1fr]
				place-content-start place-items-start
			">
				<label>Level {data.level}</label>
				<div className="text-sm text-center w-full">
					<span>XP: {data.xp} / {data.level * 1000}</span>
					<div className="
						h-2
						rounded-full
						bg-a0
						border border-b5 self-center
						mt-1
					">
						<div className="
							bg-b5 
							w-[50%] h-full rounded-full
							"/>
					</div>
				</div>
			</div>
			<div className="
				w-full
				grid grid-cols-1
				place-content-center place-items-center
			">
				<div className="relative w-full">
					<button
						type="button"
						onClick={() => setShowWindow("badge", true)}
						className="
							w-full
							bg-n6
							border border-n5 rounded-full
							text-sm
							self-center
					">
						<span className="
							text-n0
							pl-1 pr-3 py-1
							flex justify-between items-center
						">
							<span className="px-3">{data.badge}</span>
							<span className="text-xs">▼</span>
						</span>
					</button>
					{ showWindow["badge"] && <BadgeWindow /> }
				</div>
			</div>
			<div>
				<p className="text-sm text-a5">Last Login: {data.lastLogin}</p>
				<p className="text-sm text-a5">Joined: {data.createdAt}</p>
			</div>
		</div>
	);
}

export const ProfileWindow = () => {
	const { data } = usePlayerStore();

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-screen w-screen
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss={data.name ? "profile" : ""} blur={true} />
			<div className="
				h-fit w-120
				bg-linear-to-b from-n0 to-n1
				border border-n1 rounded-xl
				relative
			">
				<CloseModule dismiss={data.name ? "profile" : ""} />
				<div className="divide-y divide-n2">
					<div className="flex">
						<AvatarNameModule />
						<PlayerDataModule />
					</div>
					<AvatarSelectModule />
					<MedalsModule />
					<PlayerStatsModule />
					{ !data.name && 
						<div className="text-b4 text-sm font-medium w-full text-center">
							<p>Enter your name and choose your avatar</p>
						</div>
					}
				</div>
			</div>
		</section>
	);
}
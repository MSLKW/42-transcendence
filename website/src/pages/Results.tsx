import { useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { usePartyStore } from "../store/PartyStore";
import { HeaderModule } from "../modules/Header";
import { AvatarButton } from "../components/button/Avatar";
import { AvatarImage } from "../components/image/AvatarImage";
import { RedTriangle } from "../components/image/RedTriangle";
import { GreenTriangle } from "../components/image/GreenTriangle";

const ResultRank = () => {
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
				<h3>1</h3>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>2</h3>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>3</h3>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>4</h3>
			</div>
		</>
	);
}

const ResultPlayed = () => {
	const { members } = usePartyStore();

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
				<div className="flex flex-col place-content-center place-items-start">
					<h3>{members[0].name}</h3>
					<p>Total Wins: 1</p>
				</div>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-items-center
				gap-5
				h-full w-full
			">
				<AvatarImage />
				<div className="flex flex-col place-content-center place-items-start">
					<h3>{members[1].name}</h3>
					<p>Total Wins: 1</p>
				</div>
			</div>
			<div className="
				row-start-4 row-end-4
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
			<div className="
				row-start-5 row-end-5
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
		</>
	);
}

const ResultChange = () => {
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

const ResultTotal = () => {
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
				<h3>5</h3>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>10</h3>
			</div>
			<div className="
				row-start-4 row-end-4
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>12</h3>
			</div>
			<div className="
				row-start-5 row-end-5
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>15</h3>
			</div>
		</>
	);
}

export const Results = () => {
	const { members } = usePartyStore();
	const { setNotification } = useNotificationStore();
	const winner = "Congratulations " + members[0].name + "! Play next round?";
	useEffect(() => {
		setNotification(winner, notificationType.nextRound);
	}, []);

	return (
		<>
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
						<div className="text-center flex flex-col gap-3">
							<AvatarButton index={3} name={members[2].name ?? "Guest"} relation={members[2].relation} cornerButton="3rd" />
							<span className="text-r4">+8</span>
						</div>
						<div className="text-center flex flex-col gap-3">
							<AvatarButton index={2} name={members[3].name ?? "Guest"} relation={members[3].relation} cornerButton="4th" />
							<span className="text-r4">+15</span>
						</div>
					</div>
					<div
						className="
							grid grid-cols-[7.5rem_15rem_7.5rem_7.5rem] grid-rows-[5rem_5rem_5rem_5rem_5rem]
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
		</>
	);
}
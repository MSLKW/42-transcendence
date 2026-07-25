import React, { useState, useRef, useCallback } from "react";
import { useSceneStore } from "../store/SceneStore";
import { usePartyStore } from "../store/PartyStore";
import { AvatarMemberModule } from "../modules/AvatarMember";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { LightboxButton } from "../components/button/Lightbox";
import { UnfriendIcon } from "../components/icon/Unfriend";
import { AddFriendIcon } from "../components/icon/AddFriend";
import { CloseIcon } from "../components/icon/Close";
import { PinIcon } from "../components/icon/Pin";

export const StatsWindow: React.FC = () => {
	const { profileIndex } = useSceneStore();
	const { members } = usePartyStore();
	const [ isFriend, setIsFriend ] = useState(false);

	const [position, setPosition ] = useState({ x: 100, y: 100 });

	const draggingRef = useRef(false);
	const offsetRef = useRef({ x: 0, y: 0 });

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 0)
			return;

		draggingRef.current = true;

		offsetRef.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!draggingRef.current)
			return;

		setPosition({
			x: e.clientX - offsetRef.current.x,
			y: e.clientY - offsetRef.current.y,
		});
	}, []);

	const handleMouseUp = useCallback(() => {
		draggingRef.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	}, [handleMouseMove]);

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
			pointer-events-none
		">
			<LightboxButton dismiss="stats" blur={false} />
			<div
				style={{
					transform: `translate(${position.x}px, ${position.y}px)`,
				}} 
				className="
					absolute
					h-fit w-120
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-xl
					overflow-hidden
					pointer-events-auto
					will-change-transform
				"
			>
				<div
					onMouseDown={handleMouseDown}
					className="
						bg-a2
						flex
						place-content-between place-items-center
						box-border
						cursor-grab
						select-none
						active:cursor-grabbing
					"
				>
					<h2 className="text-n6 ml-5 pointer-events-none">Players Stats</h2>
					<div
						className="
							flex
						"
					>
						<div className="h-10 aspect-square text-n6"><PinIcon /></div>
						<div className="h-10 aspect-square text-n6"><CloseIcon /></div>
					</div>
				</div>
				<div
					className="
						window-body
						divide-y divide-n2
					"
				>
					<div className="flex">
						<AvatarMemberModule name={members[profileIndex].name ?? "Guest"} />
						<PlayerDataModule />
					</div>
					<MedalsModule />
					<PlayerStatsModule />
					<div
						className="
							flex
							place-content-evenly place-items-center
							p-5
						"
					>
						<button
							className="
								h-12 w-50
								btn-text
								bg-n6
								border border-n5
								text-n0
							"
						>
							Remove From Party
						</button>
						<button
							onClick={() => setIsFriend(!isFriend)}
							className="
								h-12 w-50
								btn-text
								text-n0 border border-n5 bg-n6
								flex
								place-content-center place-items-center
							"
						>
							{isFriend
								?
									<>
										<div className="h-10 aspect-square">
											<UnfriendIcon />
										</div>
										<span>Unfriend</span>
									</>
								:
									<>
										<div className="h-10 aspect-square">
											<AddFriendIcon />
										</div>
										<span>Add Friend</span>
									</>
							}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "../store/PlayerStore";
import { useSceneStore } from "../store/SceneStore";
import { CloseButton } from "../components/button/Close";
import { AvatarImage } from "../components/image/AvatarImage";
import { Medal } from "../components/image/Medal";
import { AvatarSelect } from "../components/button/AvatarSelect";

export const ProfileWindow = () => {
	const { setShowWindow } = useSceneStore();
	const { data, setPlayerDataValue } = usePlayerStore();
	
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (!data.name && focusRef.current)
			focusRef.current.focus();
	}, []);

	const handleDismiss = () => {
		if (!data.name)
			return;
		setShowWindow("profile", false);
	};

	const [selectedAvatar, setSelectedAvatar] = useState(0);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={handleDismiss}/>
			<div className="
				w-max h-max rounded-xl
				bg-linear-to-b from-n0 to-n1
				border border-n1
				relative
			">
				<div className="
					flex place-content-evenly place-items-center
					p-5
					gap-5
					border-b border-n2
				">
					<div className="flex flex-col gap-3 place-content-center place-items-center">
						<AvatarImage />
						<input
							ref={focusRef}
							id="name"
							type="text"
							value={data.name ?? ""}
							onChange={(e)=>{setPlayerDataValue("name", e.target.value)}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === "Escape")
									e.currentTarget.blur();
							}}
							className="
								bg-n6 h-2.5 w-30
								border border-n5 rounded-full
								p-4
								text-n0 text-center
								pointer-events-auto
								focus:outline-2 outline-b5 outline-offset-5
						"/>
					</div>
					<div className="grid grid-cols-5 grid-rows-2 gap-3">
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
						<Medal />
					</div>
				</div>
				<div className="
					flex place-content-between
					divide-x divide-n2
					w-full
				">
					<div className="grid grid-rows-3 grid-cols-3 place-content-center place-items-center gap-5 p-5">
						<AvatarSelect id="avatar-stock-0.webp" color="bg-a4"/>
						<AvatarSelect id="avatar-stock-1.webp" color="bg-b4"/>
						<AvatarSelect id="avatar-stock-2.webp" color="bg-c4"/>
						<AvatarSelect id="avatar-stock-3.webp" color="bg-d4"/>
						<AvatarSelect id="avatar-stock-4.webp" color="bg-a4"/>
						<AvatarSelect id="avatar-stock-5.webp" color="bg-b4"/>
						<AvatarSelect id="avatar-stock-6.webp" color="bg-c4"/>
						<AvatarSelect id="avatar-stock-7.webp" color="bg-d4"/>
						<AvatarSelect id="avatar-stock-8.webp" color="bg-a4"/>
					</div>
					<div className="
						grid grid-rows-3
						place-content-evenly place-items-end
						divide-y divide-n2
						text-n6
					">
						<div className="
							w-full h-full
							row-start-1 row-end-1
							flex place-content-center place-items-center
							p-5
						">
							<div className="text-center">
								<h2>Total Played</h2>
								<p>42</p>
							</div>
						</div>
						<div className="
							w-full h-full
							row-start-2 row-end-2
							flex place-content-center place-items-center
							p-5
						">
							<div className="text-center">
								<h2>Wins</h2>
								<p>5</p>
							</div>
						</div>
						<div className="
							w-full h-full
							row-start-3 row-end-3
							flex place-content-center place-items-center
							p-5
						">
							<div className="text-center">
								<h2>Win Streak</h2>
								<p>2</p>
							</div>
						</div>
					</div>
				</div>
				<div className="
					absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={handleDismiss}/>
				</div>
			</div>
		</section>
	);
}
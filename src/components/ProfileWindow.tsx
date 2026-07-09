import { useSceneStore } from "../store/useSceneStore";
import { AvatarButton } from "./Avatar";
import { CloseButton } from "./CloseButton";

export const Medal = () => {
	return (
		<div className="h-10 aspect-square rounded-full bg-a4" />
	);
}

export const ProfileWindow = () => {
	const setShowWindow = useSceneStore((state) => state.setShowWindow);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("profile", false)}/>
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
					<AvatarButton />
					<div className="grid grid-cols-5 grid-rows-2 gap-2">
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
						<button className="h-20 aspect-square rounded-sm bg-a4"/>
						<button className="h-20 aspect-square rounded-sm bg-b4"/>
						<button className="h-20 aspect-square rounded-sm bg-c4"/>
						<button className="h-20 aspect-square rounded-sm bg-d4"/>
						<button className="h-20 aspect-square rounded-sm bg-a4"/>
						<button className="h-20 aspect-square rounded-sm bg-b4"/>
						<button className="h-20 aspect-square rounded-sm bg-c4"/>
						<button className="h-20 aspect-square rounded-sm bg-d4"/>
						<button className="h-20 aspect-square rounded-sm bg-a4"/>
					</div>
					<div className="
						grid grid-rows-3
						place-content-evenly place-items-end
						divide-y divide-n2
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
					<CloseButton dismiss={() => setShowWindow("profile", false)}/>
				</div>
			</div>
		</section>
	);
}
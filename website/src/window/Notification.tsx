import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";

export const NotificationWindow = () => {
	const { message, isError, isTimed, call } = useNotificationStore();
	const { setShowWindow } = useSceneStore();
	const [ isExiting, setIsExiting ] = useState(false);
	const [ animateProgress, setAnimateProgress ] = useState(false);
	
	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => {
			if (call)
				call();
			setShowWindow("notification", false);
		}, 500);
	};

	useEffect(() => {
		setIsExiting(false);
		setAnimateProgress(false);

		if (!isTimed)
			return;

		const startTimer = setTimeout(() => {
			setAnimateProgress(true);
		}, 10);

		const closeTimer = setTimeout(() => {
			setIsExiting(true);
		}, 5000);

		const unmountTimer = setTimeout(() => {
			if (call)
				call();
			setShowWindow("notification", false);
		}, 5500);

		return () => {
			clearTimeout(startTimer);
			clearTimeout(closeTimer);
			clearTimeout(unmountTimer);
		};
	}, [message, isTimed, call, setShowWindow]);

	return createPortal(
		<div
			className={`
				fixed z-5
				top-10 left-1/2
				flex flex-col place-content-center place-items-center
				gap-2
				${ isExiting ? "animate-slide-out" : "animate-slide-in" }
		`}>
			<button
				onClick={handleClose}
				className={`
					min-w-50
					bg-n0
					border border-n1 rounded-full
					py-5 px-10
					${ !isTimed ? "cursor-pointer select-none" : "" }
					relative
			`}>
				<span className={`
					relative z-1
					${ isError ? "text-r4" : "text-n6" }
					text-center
				`}>
					{message}
				</span>
				{ isTimed && 
					<div className="
						absolute top-0 left-0
						h-full w-full rounded-full
						overflow-hidden
					">
						<div
							style={{ transitionDuration: "5000ms" }}
							className={`
								h-full rounded-full
								${ animateProgress ? "w-0" : "w-full" }
								${ isError ? "bg-r4" : "bg-a2" } opacity-30
								transition-all ease-linear
						`}/>
					</div>
				}
			</button>
			{ !isTimed &&
				<div
					className="
						flex gap-5
						w-full
				">
					<button
						type="button"
						onClick={handleClose}
						className="
							w-full p-2
							bg-n6 hover:not-disabled:bg-b4
							border border-n5 hover:not-disabled:border-b5 rounded-full
							text-n0
					">
						ACCEPT
					</button>
					<button
						type="button"
						onClick={handleClose}
						className="
							w-full p-2
							bg-n6 hover:not-disabled:bg-r4
							border border-n5 hover:not-disabled:border-r5 rounded-full
							text-n0
					">
						IGNORE
					</button>
				</div>
			}
		</div>
		, document.body
	);
}
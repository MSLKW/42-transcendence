import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore } from "../store/NotificationStore";
import { usePlayerStore } from "../store/PlayerStore";
import { useSceneStore } from "../store/SceneStore";

export const NotificationWindow = () => {
	const { message, isError, isTimed, numOfButtons, onButton1Click, onButton2Click } = useNotificationStore();
	const { data } = usePlayerStore();
	const { setShowWindow } = useSceneStore();
	const [ isExiting, setIsExiting ] = useState(false);
	const [ animateProgress, setAnimateProgress ] = useState(false);
	const isClosing = useRef(false);
	const manualUnmountTimer = useRef<number>(0);
	const exitAnimationTimer = useRef<number>(0);
	const autoUnmountTimer = useRef<number>(0);
	const animationFrame = useRef<number>(0);
	
	const handleClose = (callbackAction?: () => void) => {
		if (isClosing.current)
			return;
		isClosing.current = true;

		callbackAction?.();

		cancelAnimationFrame(animationFrame.current);
		clearTimeout(exitAnimationTimer.current);
		clearTimeout(autoUnmountTimer.current);

		setIsExiting(true);

		manualUnmountTimer.current = window.setTimeout(() => {
			setShowWindow("notification", false);
		}, 500);
	};

	const handleSetupComplete = () => {
		setShowWindow("setup", false);
		handleClose(onButton1Click);
	}

	const handleAccept = () => {
		handleClose(onButton1Click);
	};

	const handleIgnore = () => {
		handleClose(onButton2Click);
	};

	useEffect(() => {
		if (!isTimed)
			return;

		animationFrame.current = requestAnimationFrame(() => {
			setAnimateProgress(true);
		});

		exitAnimationTimer.current = window.setTimeout(() => {
			setIsExiting(true);
		}, 5000);
		
		autoUnmountTimer.current = window.setTimeout(() => {
			onButton1Click?.();
			setShowWindow("notification", false);
		}, 5500);

		return () => {
			clearTimeout(manualUnmountTimer.current);
			clearTimeout(exitAnimationTimer.current);
			clearTimeout(autoUnmountTimer.current);
			cancelAnimationFrame(animationFrame.current);
		};
	}, [isTimed, onButton1Click, setShowWindow]);

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
				type="button"
				onClick={isTimed ? handleIgnore : undefined}
				className={`
					min-w-50
					bg-n0
					border border-n1 rounded-full
					py-5 px-10
					relative cursor-pointer
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
							style={{
								transitionDuration: "5000ms"
							}}
							className={`
								h-full rounded-full
								${ animateProgress ? "w-0" : "w-full" }
								${ isError ? "bg-r4" : "bg-a2" } opacity-20
								transition-[width] ease-linear
						`}/>
					</div>
				}
			</button>
			{ numOfButtons === 1 &&
				<div
					className="
						flex gap-5
						w-full
				">
					<button
						type="button"
						onClick={handleSetupComplete}
						disabled={data.name ? false : true }
						className="
							w-full p-2
							bg-n6 hover:not-disabled:bg-b4
							border border-n5 hover:not-disabled:border-b5 rounded-full
							text-n0
					">
						{ data.name ? "Let's Play!" : "Waiting for valid name..." }
					</button>
				</div>
			}
			{ numOfButtons === 2 &&
				<div
					className="
						flex gap-5
						w-full
				">
					<button
						type="button"
						onClick={handleAccept}
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
						onClick={handleIgnore}
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
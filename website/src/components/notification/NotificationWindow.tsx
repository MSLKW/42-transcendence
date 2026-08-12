import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { useSceneStore } from "../../store/SceneStore";

export const NotificationWindow = () => {
	const { type, message, isError, isTimed, numOfButtons, onButton1Click, onButton2Click } = useNotificationStore();
	const { setShowWindow } = useSceneStore();
	const [ isExiting, setIsExiting ] = useState(false);
	const [ animateProgress, setAnimateProgress ] = useState(false);
	const isClosing = useRef(false);
	const manualUnmountTimer = useRef<number>(0);
	const exitAnimationTimer = useRef<number>(0);
	const autoUnmountTimer = useRef<number>(0);
	const animationFrame = useRef<number>(0);
	
	const handleClose = () => {
		if (isClosing.current)
			return;
		isClosing.current = true;

		cancelAnimationFrame(animationFrame.current);
		clearTimeout(exitAnimationTimer.current);
		clearTimeout(autoUnmountTimer.current);

		setIsExiting(true);

		manualUnmountTimer.current = window.setTimeout(() => {
			setShowWindow("notification", false);
		}, 500);
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
	}, [isTimed, onButton1Click, setShowWindow, isExiting]);

	return createPortal(
		<div
			className={`
				absolute z-5
				top-10 left-1/2
				flex flex-col place-content-center place-items-center
				gap-0.5rem
				${ isExiting ? "animate-slide-out" : "animate-slide-in" }
		`}>
			<button
				type="button"
				onClick={isTimed ? handleClose : undefined}
				className={`
					min-w-50
					bg-n0
					border border-n1 rounded-full
					py-1.5rem px-3rem
					relative ${numOfButtons === 0 ? "cursor-pointer" : "cursor-default" }
			`}>
				<span className={`
					relative z-1
					${ isError ? "text-r4" : "text-n6" }
					text-1.25rem text-center
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
			{ numOfButtons !== 0 &&
				<div
					className="
						flex gap-5
						w-full
				">
					<button
						type="button"
						onClick={onButton1Click}
						className="
							btn-text bg-light
							h-3rem w-full
							text-1.25rem text-n0
							
					">
						{ type === NOTIFICATION_TYPE.invite && "Accept" }
						{ type === NOTIFICATION_TYPE.nextRound && "End" }
						{ type === NOTIFICATION_TYPE.botSelect && "OK!" }
					</button>
					<button
						type="button"
						onClick={onButton2Click}
						className="
							btn-text bg-light
							w-full
							text-1.25rem text-n0
					">
						{ type === NOTIFICATION_TYPE.invite &&
							"Reject"
						}
						{ type === NOTIFICATION_TYPE.nextRound &&
							"Continue"
						}
					</button>
				</div>
			}
		</div>
		, document.body
	);
}
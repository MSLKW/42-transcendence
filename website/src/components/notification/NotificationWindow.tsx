import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore, notificationType } from "../../store/NotificationStore";
import { usePlayerStore } from "../../store/PlayerStore";
import { useSceneStore } from "../../store/SceneStore";

export const NotificationWindow = () => {
	const { type, message, isError, isTimed, numOfButtons, onButton1Click, onButton2Click } = useNotificationStore();
	const { data } = usePlayerStore();
	const { setShowWindow, setCurrentScene } = useSceneStore();
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

	const handleBotSelect = () => {
		setShowWindow("bots", false);
		handleClose(onButton1Click);
	}

	const handleAccept = () => {
		handleClose(onButton1Click);
	};

	const handleIgnore = () => {
		handleClose(onButton2Click);
	};

	const handleEndGame = () => {
		setCurrentScene("HOME");
		handleClose(onButton1Click);
	};

	const handleContinueGame = () => {
		setCurrentScene("R3F");
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
				absolute z-5
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
					relative ${numOfButtons === 0 ? "cursor-pointer" : "cursor-default" }
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
						onClick={type === notificationType.nameInput ? handleSetupComplete : handleBotSelect}
						disabled={data.name ? false : true }
						className="
							btn-text bg-light
							h-3rem w-full
							text-1.25rem text-n0
					">
						{ type === notificationType.nameInput && 
							(data.name ? "Let's Play!" : "Waiting for valid name...")
						}
						{ type === notificationType.botSelect &&
							"OK!"
						}
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
						onClick={type === notificationType.invite ? handleAccept : handleEndGame}
						className="
							btn-text bg-light
							h-3rem w-full
							text-1.25rem text-n0
							
					">
						{ type === notificationType.invite &&
							"Accept"
						}
						{ type === notificationType.nextRound &&
							"End"
						}
					</button>
					<button
						type="button"
						onClick={type === notificationType.invite ? handleIgnore : handleContinueGame}
						className="
							btn-text bg-light
							w-full
							text-1.25rem text-n0
					">
						{ type === notificationType.invite &&
							"Ignore"
						}
						{ type === notificationType.nextRound &&
							"Continue"
						}
					</button>
				</div>
			}
		</div>
		, document.body
	);
}
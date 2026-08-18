import { useState, useRef, useEffect } from "react";
import { useNotificationStore, type NotificationItem } from "../../store/NotificationStore";

interface SingleNotificationProps {
	notification: NotificationItem;
}

export const SingleNotification = ({ notification }: SingleNotificationProps) => {
	const { id, message, isError, isTimed, numOfButtons, onButton1Click, onButton2Click } = notification;
	const { removeNotification } = useNotificationStore();
	
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
			removeNotification(id);
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
			removeNotification(id);
		}, 5500);

		return () => {
			clearTimeout(manualUnmountTimer.current);
			clearTimeout(exitAnimationTimer.current);
			clearTimeout(autoUnmountTimer.current);
			cancelAnimationFrame(animationFrame.current);
		};
	}, [isTimed, onButton1Click, id, removeNotification]);

	return (
		<div
			className={`
				flex flex-col items-center
				gap-0.5rem
				pointer-events-auto w-full
				${ isExiting ? "animate-slide-out" : "animate-slide-in" }
			`}
		>
			<button
				type="button"
				onClick={isTimed ? handleClose : undefined}
				className={`
					w-full min-w-50
					bg-n1/40 border border-n1 rounded-full
					py-1rem px-1rem
					relative
					${numOfButtons === 0 ? "cursor-pointer" : "cursor-default" }
				`}
			>
				<span
					className={`
						relative z-1
						text-n6
						text-1.25rem text-center block
					`}
				>
					{message}
				</span>
				{ isTimed &&
					<div
						className="
							absolute top-0 left-0
							h-full w-full rounded-full
							overflow-hidden
						"
					>
						<div
							style={{
								transitionDuration: "5000ms"
							}}
							className={`
								h-full rounded-full
								${ animateProgress ? "w-0" : "w-full" }
								${ isError ? "bg-r1" : "bg-a1" }
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
						onClick={() => {
							onButton1Click?.();
							removeNotification(id);
						}}
						className="
							btn-text bg-light
							h-3rem w-full
							text-1.25rem text-n0
						"
					>
						Accept
					</button>
					<button
						type="button"
						onClick={() => {
							onButton2Click?.();
							removeNotification(id);
						}}
						className="
							btn-text bg-light
							w-full
							text-1.25rem text-n0
						"
					>
						Reject
					</button>
				</div>
			}
		</div>
	);
}
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";

export const NotificationWindow = () => {
	const { message, isError, isTimed, call } = useNotificationStore();
	const { setShowWindow } = useSceneStore();
	
	useEffect(() => {
		if (!isTimed)
			return;

		const timer = setTimeout(() => {
			setShowWindow("notification", false);
		}, 3000);
		return () => clearTimeout(timer);
	}, [message, isTimed, setShowWindow]);

	return createPortal(
		<div className={`
			fixed z-5
			top-10 left-1/2 -translate-x-1/2
			flex flex-col place-content-center place-items-center
			gap-5
			animate-fade-in-down
		`}>
			<div className={`
				min-w-50
				bg-n1
				border border-n2 rounded-full
				p-5
				${ isError ? "text-r4" : "text-n6" }
				text-center
			`}>
				<span>{message}</span>
			</div>
			<button
				type="button"
				onClick={() => {
					if (call)
						call();
					setShowWindow("notification", false);
				}}
				className="
					w-20 p-2
					bg-n6
					border border-n5 rounded-full
					text-n0
			">
				OK
			</button>
		</div>,
		document.body
	);
}
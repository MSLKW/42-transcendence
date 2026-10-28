import { useSceneStore } from "../../store/SceneStore";

interface LightboxButtonProps {
	dismiss: string;
	blur?: boolean;
	isDismissable?: boolean;
	call?: () => void;
}

export const LightboxButton = ({ dismiss, blur, isDismissable = true, call }: LightboxButtonProps) => {
	return (
		<button
			tabIndex={-1}
			onClick={
				call
					? call
					: () => {
						if (isDismissable)
							useSceneStore.getState().setShowWindow(dismiss, false);
					}
			}
			className={`
				fixed -z-1
				h-screen w-screen
				${ blur ? "backdrop-blur-xs" : "" }
				${ isDismissable ? "cursor-alias" : ""}
			`}
		/>
	);
}
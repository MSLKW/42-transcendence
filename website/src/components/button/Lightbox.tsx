import { useSceneStore } from "../../store/SceneStore";

interface LightboxButtonProps {
	dismiss: string,
	blur?: boolean,
	isDismissable?: boolean,
}

export const LightboxButton = ({ dismiss, blur, isDismissable = true }: LightboxButtonProps) => {
	const { setShowWindow } = useSceneStore();

	return (
		<button
			tabIndex={-1}
			onClick={() => {
				if (isDismissable)
					setShowWindow(dismiss, false);
			}}
			className={`
				fixed -z-1
				h-screen w-screen
				${ blur ? "backdrop-blur-xs" : "" }
				cursor-alias
			`}
		/>
	);
}
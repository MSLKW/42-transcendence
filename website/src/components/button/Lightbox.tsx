import { useSceneStore } from "../../store/SceneStore";

interface LightboxButtonProps {
	dismiss: string,
	blur?: boolean,
}

export const LightboxButton = ({ dismiss, blur }: LightboxButtonProps) => {
	const { setShowWindow } = useSceneStore();

	return (
		<button
			tabIndex={-1}
			onClick={() => setShowWindow(dismiss, false)}
			className={`
				-z-1 absolute
				w-full h-full
				${ blur ? "backdrop-blur-xs" : "" }
		`}/>
	);
}
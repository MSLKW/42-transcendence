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
			onClick={() => {
				console.log("234d5rtfyvbhjn")
				setShowWindow(dismiss, false)
			}}
			className={`
				-z-1 absolute
				h-screen w-screen
				${ blur ? "backdrop-blur-xs" : "" }
		`}/>
	);
}
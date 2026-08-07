import { useSceneStore } from "../store/SceneStore";
import { CloseButton } from "../components/button/Close";

interface CloseModuleProps {
	dismiss: string,
}

export const CloseModule = ({ dismiss }: CloseModuleProps) => {
	const { setShowWindow } = useSceneStore();

	return (
		<div className="
			absolute
			z-1
			top-0 -translate-y-1/2
			right-0 translate-x-1/2
			h-12.5 w-12.5
		">
			<CloseButton dismiss={() => setShowWindow(dismiss, false)}/>
		</div>
	);
}
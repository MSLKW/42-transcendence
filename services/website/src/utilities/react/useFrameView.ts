import { useEffect } from "react";
import { useSceneStore } from "../../store/SceneStore";

export const useFrameView = () => {
	const showFrame = useSceneStore((store) => store.showFrame);
	
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('frame-mode');
		else
			document.documentElement.classList.remove('frame-mode');
	}, [showFrame]);
}
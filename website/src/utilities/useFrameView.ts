import { useEffect } from "react";
import { useDevStore } from "../store/DevStore";

export const useFrameView = () => {
	const { showFrame } = useDevStore();
	
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('frame-mode');
		else
			document.documentElement.classList.remove('frame-mode');
	}, [showFrame]);
}
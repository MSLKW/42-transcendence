import { useRef } from "react";
import { initializeUiSoundsOnUserGesture, playUiSound } from "../../../audio/uiSounds";
import { useSceneStore } from "../../../store/SceneStore";

export const CreateAccountButton = () => {
	const showWindow =  useSceneStore((store) => store.showWindow);
	const pointerFocusRef = useRef(false);

	return (
		<button
			type="button"
			onPointerEnter={() => playUiSound("hover")}
			onPointerDown={() => {
				pointerFocusRef.current = true;
				initializeUiSoundsOnUserGesture();
				playUiSound("click");
			}}
			onPointerUp={() => playUiSound("release")}
			onFocus={() => {
				if (!pointerFocusRef.current)
					playUiSound("hover");
			}}
			onBlur={() => pointerFocusRef.current = false }
			onKeyDown={(event) => {
				if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
					initializeUiSoundsOnUserGesture();
					playUiSound("click");
				}
			}}
			onKeyUp={(event) => {
				if (event.key === "Enter" || event.key === " ")
					playUiSound("release");
			}}
			onClick={() => useSceneStore.getState().setShowWindow("createAccount", !showWindow.createAccount)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
		">
			CREATE ACCOUNT
		</button>
	);
}

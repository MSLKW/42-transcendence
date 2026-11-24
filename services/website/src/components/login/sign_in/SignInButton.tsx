import { useRef } from "react";
import { playUiSound } from "../../../audio/uiSounds";
import { useSceneStore } from "../../../store/SceneStore";

export const SignInButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const pointerFocusRef = useRef(false);

	return (
		<button
			type="button"
			onPointerEnter={() => playUiSound("hover")}
			onPointerDown={() => {
				pointerFocusRef.current = true;
				playUiSound("click");
			}}
			onPointerUp={() => playUiSound("release")}
			onFocus={() => {
				if (!pointerFocusRef.current)
					playUiSound("hover");
			}}
			onKeyDown={(event) => {
				if ((event.key === "Enter" || event.key === " ") && !event.repeat)
					playUiSound("click");
			}}
			onKeyUp={(event) => {
				if (event.key === "Enter" || event.key === " ")
					playUiSound("release");
			}}
			onClick={() => useSceneStore.getState().setShowWindow("signIn", !showWindow.signIn)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
		">
			SIGN IN
		</button>
	);
}

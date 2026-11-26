import { useRef } from "react";
import { playUiSound, type UiSound } from "./uiSounds";

interface UiSoundPropsOptions {
	pointerEnter?: boolean;
	pointerDown?: boolean;
	pointerUp?: boolean;
	keyDown?: boolean;
	keyUp?: boolean;
	upSound?: UiSound;
}

/** Shared pointer, keyboard, and focus sounds for interactive controls. */
export const useUiSoundProps = (options: UiSoundPropsOptions = {}) => {
	const {
		pointerEnter = true,
		pointerDown = true,
		pointerUp = true,
		keyDown = true,
		keyUp = true,
		upSound = "release",
	} = options;
	const pointerFocusRef = useRef(false);

	return {
		onPointerEnter: () => {
			if (pointerEnter)
				playUiSound("hover");
		},
		onPointerDown: () => {
			pointerFocusRef.current = true;
			if (pointerDown)
				playUiSound("click");
		},
		onPointerUp: () => {
			if (pointerUp)
				playUiSound(upSound);
		},
		onBlur: () => {
			pointerFocusRef.current = false;
		},
		onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
			if (keyDown && (event.key === "Enter" || event.key === " ") && !event.repeat)
				playUiSound("click");
		},
		onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
			if (keyUp && (event.key === "Enter" || event.key === " "))
				playUiSound(upSound);
		},
	};
};

import { useRef } from "react";
import { playUiSound, type UiSound } from "../../audio/uiSounds";

interface UiSoundPropsOptions {
	pointerEnter?: boolean;
	pointerDown?: boolean;
	pointerUp?: boolean;
	focus?: boolean;
	keyDown?: boolean;
	keyUp?: boolean;
	suppressNextFocus?: boolean;
	upSound?: UiSound;
}

/** Shared pointer, keyboard, and focus sounds for interactive controls. */
export const useUiSoundProps = (options: UiSoundPropsOptions = {}) => {
	const {
		pointerEnter = true,
		pointerDown = true,
		pointerUp = true,
		focus = true,
		keyDown = true,
		keyUp = true,
		suppressNextFocus = false,
		upSound = "release",
	} = options;
	const pointerFocusRef = useRef(false);
	const suppressNextFocusSoundRef = useRef(suppressNextFocus);

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
		onFocus: () => {
			if (suppressNextFocusSoundRef.current) {
				suppressNextFocusSoundRef.current = false;
				return;
			}
			if (focus && !pointerFocusRef.current)
				playUiSound("hover");
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

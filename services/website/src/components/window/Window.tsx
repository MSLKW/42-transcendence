import { useEffect, useRef, type ReactNode } from "react";
import { useChatStore } from "../../store/ChatStore";
import { useSceneStore } from "../../store/SceneStore";
import { Tooltip } from "../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../utilities/audio/useUiSoundProps";
import { playUiSound } from "../../utilities/audio/uiSounds";
import { useWindowDrag } from "../../utilities/react/useWindowDrag";
import { LightboxButton } from "../lightbox/LightboxButton";
import { ClearIcon } from "./clear/ClearIcon";
import { CloseIcon } from "./close/CloseIcon";

export type HEADER_TYPE = "Standard" | "None" | "Warning";

interface WindowProps {
	title: string;
	dismissKey: string;
	children: ReactNode;
	placement?: string;
	headerType?: HEADER_TYPE;
	hasClearChatButton?: boolean;
	lightbox?: boolean;
	isDismissable?: boolean;
	call?: () => void | undefined;
}

export const Window: React.FC<WindowProps> = ({
	title,
	dismissKey,
	children,
	placement = "c",
	headerType = "Standard",
	hasClearChatButton = false,
	lightbox = false,
	isDismissable = true,
	call,
}) => {
	const { position, handleMouseDown } = useWindowDrag();
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!lightbox)
			return;

		const previouslyFocused = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null;
		const dialog = dialogRef.current;
		if (!dialog)
			return;

		const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
			'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
		)).filter((element) => element.getAttribute("aria-hidden") !== "true");

		const focusable = getFocusable();
		(focusable[0] ?? dialog).focus();

		const handleTab = (event: KeyboardEvent) => {
			if (event.key !== "Tab")
				return;
			const items = getFocusable();
			if (items.length === 0) {
				event.preventDefault();
				dialog.focus();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleTab);
		return () => {
			document.removeEventListener("keydown", handleTab);
			if (previouslyFocused?.isConnected)
				previouslyFocused.focus();
		};
	}, [lightbox]);

	useEffect(() => {
		if (!isDismissable)
			return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape")
				return;

			if (call)
				call();
			else
				useSceneStore.getState().setShowWindow(dismissKey, false);
			playUiSound("release");
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [call, dismissKey, isDismissable]);

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
			pointer-events-none
		">
			{ lightbox &&
				<LightboxButton
					dismiss={dismissKey}
					blur={true}
					call={call}
					isDismissable={isDismissable}
				/>
			}
			<div
				ref={dialogRef}
				tabIndex={lightbox ? -1 : undefined}
				role={lightbox ? "dialog" : undefined}
				aria-modal={lightbox ? true : undefined}
				style={{ transform: `translate(${position.x}px, ${position.y}px)`, }} 
				className={`
					absolute
					${
						placement === "br" ? "bottom-10 right-10" :
						placement === "bl" ? "bottom-50 left-10" :
						""
					}
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-xl
					pointer-events-auto
					will-change-transform overflow-hidden
			`}>
				{ headerType !== "None" &&
					<div
						onMouseDown={handleMouseDown}
						onPointerDown={() => playUiSound("click")}
						onPointerUp={() => playUiSound("release")}
						className={`
							h-4rem
							${ headerType === "Standard" ? "bg-a2" : "bg-r2" }
							rounded-t-lg
							flex place-content-between place-items-center
							cursor-grab active:cursor-grabbing
							select-none
					`}>
						<h2 className="
							text-n6
							ml-5
							pointer-events-none
						">
							{title}
						</h2>
						<div className="flex">
							{ hasClearChatButton &&
								<Tooltip text="Clear Chat">
									<button
										type="button"
										{...useUiSoundProps()}
										onClick={() => useChatStore.setState({ chatLog: [] })}
										className="btn-icon -outline-offset-4"
									>
										<ClearIcon />
									</button>
								</Tooltip>
							}
							<Tooltip text="Close Window">
								<button
									type="button"
									{...useUiSoundProps()}
									disabled={!isDismissable}
									onClick={call ? call : () => useSceneStore.getState().setShowWindow(dismissKey, false)}
									className="btn-icon -outline-offset-4"
								>
									<CloseIcon />
								</button>
							</Tooltip>
						</div>
					</div>
				}
				{children}
			</div>
		</section>
	);
};

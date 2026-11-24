import { useRef, type ReactNode } from "react";
import { useChatStore } from "../../store/ChatStore";
import { useSceneStore } from "../../store/SceneStore";
import { playUiSound } from "../../audio/uiSounds";
import { Tooltip } from "../../utilities/react/Tooltip";
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
	const pointerFocusRef = useRef(false);

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
										onClick={() => useChatStore.setState({ chatLog: [] })}
										className="btn-icon"
									>
										<ClearIcon />
									</button>
								</Tooltip>
							}
							<Tooltip text="Close Window">
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
									disabled={!isDismissable}
									onClick={call ? call : () => useSceneStore.getState().setShowWindow(dismissKey, false)}
									className="btn-icon"
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
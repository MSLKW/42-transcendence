import type { ReactNode } from "react";
import { useChatStore } from "../../store/ChatStore";
import { useSceneStore } from "../../store/SceneStore";
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
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const { position, handleMouseDown } = useWindowDrag();

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
										onClick={() => useChatStore.setState({ cachedChat: [] })}
										className="btn-icon"
									>
										<ClearIcon />
									</button>
								</Tooltip>
							}
							<Tooltip text="Close Window">
								<button
									disabled={!isDismissable}
									onClick={call ? call : () => setShowWindow(dismissKey, false)}
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
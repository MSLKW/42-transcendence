import { useState, type ReactNode } from "react";
import { useSceneStore } from "../../store/SceneStore";
import { useWindowDrag } from "../../utilities/useWindowDrag";
import { LightboxButton } from "../lightbox/LightboxButton";
import { PinActiveIcon } from "./pin/PinActiveIcon";
import { PinInactiveIcon } from "./pin/PinInactiveIcon";
import { CloseIcon } from "./close/CloseIcon";
// import { MaximizeIcon } from "./maximize/MaximizeIcon";

export type HEADER_TYPE = "Standard" | "None" | "Warning";

interface WindowProps {
	title: string;
	dismissKey: string;
	children: ReactNode;
	placement?: string;
	headerType?: HEADER_TYPE;
	hasPinButton?: boolean;
	pinState?: boolean;
	isDismissable?: boolean;
	call?: () => void | undefined;
}

export const Window: React.FC<WindowProps> = ({
	title,
	dismissKey,
	children,
	placement = "c",
	headerType = "Standard",
	hasPinButton = true,
	pinState = true,
	isDismissable = true,
	call,
}) => {
	const [isPinned, setIsPinned] = useState(pinState);
	const { position, handleMouseDown } = useWindowDrag();
	const { setShowWindow } = useSceneStore();

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
			pointer-events-none
		">
			{ headerType === "Standard" && isPinned &&
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
					${ placement === "br" && "bottom-10 right-10"}
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-xl
					pointer-events-auto
					will-change-transform
				`}
			>
				{ headerType !== "None" &&
					<div
						onMouseDown={!isPinned ? handleMouseDown : undefined}
						className={`
							h-4rem
							${ headerType === "Standard" ? "bg-a2" : "bg-r2" }
							rounded-t-lg
							flex place-content-between place-items-center
							${ !isPinned && "cursor-grab active:cursor-grabbing" }
							select-none
						`}
					>
						<h2
							className="
								text-n6
								ml-5
								pointer-events-none
							"
						>
							{title}
						</h2>
						<div className="flex">
							{ hasPinButton &&
								<button
									data-tip={isPinned ? "Unpin Window" : "Pin Window"}
									onClick={() => setIsPinned(!isPinned)}
									className="btn-icon data-tip-down"
								>
									{ isPinned ? <PinActiveIcon /> : <PinInactiveIcon /> }
								</button>
							}
							{/* { profileIndex != 0 &&
								<button
									data-tip="Open In New Window"
									onClick={() => {
										const statsHTML = `
											<!DOCTYPE html>
											<html lang="en">
											<head>
												<meta charset="UTF-8">
												<title>Stats - ${members[profileIndex]?.name || "Player"}</title>
												<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
												<style>
													body { background: #000; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
												</style>
											</head>
											<body>
												<div class="h-fit w-120 bg-linear-to-b from-n0 to-n1 border border-n2 rounded-xl overflow-hidden">
													<div class="bg-a2 flex place-content-between place-items-center p-2 box-border select-none">
														<h2 class="text-n6 ml-5 font-bold">Stats: ${members[profileIndex]?.name || "Guest"}</h2>
													</div>
													<div class="window-body divide-y divide-n2 text-white p-4">
														<p>Stats: ${members[profileIndex]?.name || "Guest"}</p>
													</div>
												</div>
											</body>
											</html>
										`;

										const blob = new Blob([statsHTML], { type: "text/html" });
										const url = URL.createObjectURL(blob);

										window.open(url, "_blank", "width=500,height=700");
										setShowWindow(dismissKey, false);
									}}
									className="btn-icon data-tip-down"
								>
									<MaximizeIcon />
								</button>
							} */}
							<button
								data-tip="Close Window"
								disabled={!isDismissable}
								onClick={
									call
										? call
										: () => setShowWindow(dismissKey, false)
								}
								className="btn-icon data-tip-down"
							>
								<CloseIcon />
							</button>
						</div>
					</div>
				}
				{children}
			</div>
		</section>
	);
};
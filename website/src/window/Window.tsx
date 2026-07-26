import React, { useState, type ReactNode } from "react";
import { usePartyStore } from "../store/PartyStore";
import { useSceneStore } from "../store/SceneStore";
import { useDraggable } from "./useDraggable";
import { LightboxButton } from "../components/button/Lightbox";
import { PinInactiveIcon, PinActiveIcon } from "../components/icon/Pin";
import { CloseIcon } from "../components/icon/Close";
import { MaximizeIcon } from "../components/icon/Maximize";

interface WindowProps {
	title: string;
	dismissKey: string;
	children: ReactNode;
	placement?: string;
	hasHeader?: boolean;
	pinState?: boolean;
	profileIndex?: number;
}

export const Window: React.FC<WindowProps> = ({
	title,
	dismissKey,
	children,
	placement = "c",
	hasHeader = true,
	pinState = true,
	profileIndex = 0,
}) => {
	const [isPinned, setIsPinned] = useState(pinState);
	const { position, handleMouseDown } = useDraggable();
	const { members } = usePartyStore();
	const { setShowWindow } = useSceneStore();

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
			pointer-events-none
		">
			{ hasHeader && isPinned && <LightboxButton dismiss={dismissKey} blur={true} /> }
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
				{ hasHeader &&
					<div
						onMouseDown={!isPinned ? handleMouseDown : undefined}
						className={`
							h-4rem
							bg-a2 rounded-t-lg
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
							<button
								onClick={() => setIsPinned(!isPinned)}
								className="
									btn-icon
									h-10 aspect-square
									text-n6
								"
							>
								{ isPinned ? <PinActiveIcon /> : <PinInactiveIcon /> }
							</button>
							{ profileIndex != 0 &&
								<button
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
														<h2 class="text-n6 ml-5 font-bold">Stats - ${members[profileIndex]?.name || "Guest"}</h2>
													</div>
													<div class="window-body divide-y divide-n2 text-white p-4">
														<p>Profile Index: ${profileIndex}</p>
														<p>Isolated window content goes here entirely independent of parent UI.</p>
													</div>
												</div>
											</body>
											</html>
										`;

										const blob = new Blob([statsHTML], { type: "text/html" });
										const url = URL.createObjectURL(blob);

										window.open(url, "_blank", "width=500,height=700");
									}}
									className="
										btn-icon
										h-10 aspect-square
										text-n6
									"
								>
									<MaximizeIcon />
								</button>
							}
							<button
								onClick={() => {setShowWindow(dismissKey, false)}}
								className="
									btn-icon
									h-10 aspect-square
								"
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
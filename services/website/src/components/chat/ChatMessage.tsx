import type { ChatData } from "../../store/ChatStore";
import { useAuthStore } from "../../store/AuthStore";
import { AvatarImage } from "../avatar/image/AvatarImage";

interface ChatProps {
	data: ChatData;
	isFirstFromClient: boolean;
	isLastFromClient: boolean;
}

export const ChatMessage = ({ data, isFirstFromClient, isLastFromClient }: ChatProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);

	return (
		<>
			{ data.type === "MESSAGE" &&
				<>
					{data.uuid === clientUuid ? (
						<div
							className={`
								flex place-content-end place-items-start
								gap-1rem
								${ isFirstFromClient ? "mt-4" : "" }
								${ isLastFromClient ? "mb-4" : "mb-2" }
							`}
						>
							<div
								className="
									max-w-[75%]
									flex flex-col
									text-left wrap-break-word
									bg-a3 border border-a4 rounded-md
									px-1rem py-0.5rem
								"
							>
								<p className="text-b5 font-bold">{data.name}</p>
								<span className={`${data.type === "MESSAGE" ? "text-1.25rem" : "text-xl"}`}>
									{data.msg}
								</span>
							</div>
							<div className="h-5rem aspect-square">
								{isFirstFromClient &&
									<AvatarImage uuid={data.uuid} image={data.avatar} isChat={true}/>
								}
							</div>
						</div>
					) : (
						<div
							className={`
								flex place-content-start place-items-start
								gap-1rem
								${ isFirstFromClient ? "mt-4" : "" }
								${ isLastFromClient ? "mb-4" : "mb-2" }
							`}
						>
							<div className="h-5rem aspect-square">
								{isFirstFromClient &&
									<AvatarImage uuid={data.uuid} image={data.avatar} isChat={true}/>
								}
							</div>
							<div
								className="
									max-w-[75%]
									flex flex-col
									text-left wrap-break-word
									bg-a3 border border-a4 rounded-md
									px-1rem py-0.5rem
								"
							>
								<p className="text-b5 font-bold">{data.name}</p>
								<span className={`${data.type === "MESSAGE" ? "text-1.25rem" : "text-xl"}`}>
									{data.msg}
								</span>
							</div>
						</div>
					)}
				</>
			}
		</>
	);
}
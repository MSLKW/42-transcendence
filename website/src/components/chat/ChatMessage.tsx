import type { ChatData } from "../../store/ChatStore";
import { useProfileStore } from "../../store/ProfileStore";
import { AvatarImage } from "../avatar/image/AvatarImage";

interface ChatProps {
	data: ChatData;
}

export const ChatMessage = ({ data }: ChatProps) => {
	const { clientUuid } = useProfileStore();

	return (
		<>
			{data.uuid === clientUuid ? (
				<div className="flex place-content-end place-items-start gap-5">
					<div
						className="
							max-w-[75%]
							flex flex-col
							text-right wrap-break-word
							bg-a3 border border-a4 rounded-xl
							px-1rem py-1rem
						">
						<h3 className="text-b5 font-bold">{data.name}</h3>
						<p>{data.msg}</p>
					</div>
					<AvatarImage uuid={data.uuid} image={data.avatar}/>
				</div>
			) : (
				<div className="flex place-content-start place-items-start gap-5">
					<AvatarImage uuid={data.uuid} image={data.avatar}/>
					<div
						className="
							max-w-[75%]
							flex flex-col
							text-left wrap-break-word
							bg-a3 border border-a4 rounded-xl
							px-1rem py-1rem
						">
						<h3 className="text-b5 font-bold">{data.name}</h3>
						<p>{data.msg}</p>
					</div>
				</div>
			)}
		</>
	);
}
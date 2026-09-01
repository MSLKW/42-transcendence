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
					<div className="flex flex-col gap-1 text-right bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{data.name}</p>
						<p>{data.msg}</p>
					</div>
					<AvatarImage uuid={data.uuid} image={data.avatar}/>
				</div>
			) : (
				<div className="flex place-content-start place-items-start gap-5">
					<AvatarImage uuid={data.uuid} image={data.avatar}/>
					<div className="flex flex-col gap-1 text-left bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{data.name}</p>
						<p>{data.msg}</p>
					</div>
				</div>
			)}
		</>
	);
}
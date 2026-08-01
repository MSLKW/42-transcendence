import { AvatarImage } from "../avatar/AvatarImage";

interface ChatProps {
	senderId?: number;
	senderName?: string;
	message?: string;
}

export const ChatBubble = ({ senderId, senderName, message }: ChatProps) => {
	return (
		<>
			{senderId === 0 ? (
				<div className="flex place-content-end place-items-start gap-5">
					<div className="flex flex-col gap-1 text-right bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{senderName}</p>
						<p>{message}</p>
					</div>
					<AvatarImage />
				</div>
			) : (
				<div className="flex place-content-start place-items-start gap-5">
					<AvatarImage />
					<div className="flex flex-col gap-1 text-left bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{senderName}</p>
						<p>{message}</p>
					</div>
				</div>
			)}
		</>
	);
}
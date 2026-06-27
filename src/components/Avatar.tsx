import { useState } from "react";
import { ChatIcon } from "../icons/ChatIcon";

export const AvatarPlayer = () => {
	const [showChat, setShowChat] = useState(true);
	return (
		<div className="
			h-full min-h-0 max-h-25
			aspect-8/10
			relative
		">
			<div className="
				h-4/5
				bg-a5
				border border-a6
				rounded-t-[clamp(0px,2vh,8px)]
			">
			</div>
			<div className="
				h-1/5
				bg-n1
				border border-n2
				rounded-b-[clamp(0px,2vh,8px)]
				text-[clamp(0px,2vh,14px)] text-n6 flex place-content-center place-items-center
			">
				<p>Player</p>
			</div>
			{showChat &&
				<button
					data-tip="Chat"
					className="
						btn-icon
						absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
						btn-tip-up
						bg-n1
						border border-n2
					"
				>
					<ChatIcon />
				</button>
			}
		</div>
	);
}
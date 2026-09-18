import type { ChatData } from "../../store/ChatStore";

interface ChatReportProps {
	data: ChatData;
}

export const ChatReport = ({ data }: ChatReportProps) => {
	return (
		<div className="
			w-full h-max
			flex place-content-center place-items-center justify-center
		">
			<div className="
				w-max h-max
				bg-dark rounded-full
				text-n6
				py-0.5rem px-1rem my-1
			">
				<p>{data.msg}</p>
			</div>
		</div>
	);
}


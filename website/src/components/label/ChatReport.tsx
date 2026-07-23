interface ChatProps {
	message?: string;
}

export const ChatReport = ({ message }: ChatProps) => {
	return (
		<div className="
			w-full h-max
			flex place-content-center place-items-center justify-center
		">
			<div className="
				w-max h-max
				bg-n2
				border border-n3 rounded-3xl
				text-n6
				text-[clamp(0.25rem,2vw+0.125rem,0.75rem)]
				px-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
				py-[clamp(0.0625rem,0.5vh+0.03125rem,0.5rem)]
			">
				<p>{message}</p>
			</div>
		</div>
	);
}


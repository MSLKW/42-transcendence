interface AvatarSetImageButtonProps {
	id: string;
	avatar: string;
	setAvatar: (img: string) => void;
}

export const AvatarSetImageButton = ({ id, avatar, setAvatar }: AvatarSetImageButtonProps) => {
	return (
		<button 
			onClick={() => setAvatar(id)}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-double hover:not-disabled:outline-double outline-b5 outline-offset-5 ${id === avatar && "outline-2"}
				h-6rem aspect-square
				border border-a5 rounded-sm
				cursor-pointer
			`}
		>
			<img
				src={id}
				alt={id}
				loading="lazy"
			/>
		</button>
	)
}
interface AvatarSetImageButtonProps {
	id: string | null;
	avatar: string | undefined;
	setAvatar: (img: string) => void;
}

export const AvatarSetImageButton = ({ id, avatar, setAvatar }: AvatarSetImageButtonProps) => {
	return (
		<button 
			onClick={() => setAvatar(id)}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-double hover:not-disabled:outline-double outline-b5 outline-offset-5
				${id === avatar ? "outline-2 border-b4 bg-b5/40" : "border-n2 bg-n3/20"}
				h-6rem aspect-square
				border rounded-sm
				cursor-pointer
			`}
		>
			{
				id &&
					<img
						src={id}
						alt={id}
						loading="lazy"
					/>
			}
		</button>
	)
}
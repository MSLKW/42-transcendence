interface AvatarSetImageButtonProps {
	id: string,
	color: string,
	avatar: string,
	setAvatar: (img: string) => void;
}

export const AvatarSetImageButton = ({ id, color, avatar, setAvatar }: AvatarSetImageButtonProps) => {
	return (
		<button 
			onClick={() => setAvatar(id)}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-double outline-b5 outline-offset-5
				h-8rem aspect-square rounded-sm
				${id === avatar && "outline-2"}
				${color}
				cursor-pointer
		`}/>
	)
}
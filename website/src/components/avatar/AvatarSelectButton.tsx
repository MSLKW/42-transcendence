interface AvatarSelectButtonProps {
	id: string,
	color: string,
	avatar: string,
	setAvatar: (img: string) => void;
}

export const AvatarSelectButton = ({ id, color, avatar, setAvatar }: AvatarSelectButtonProps) => {
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
interface AvatarSelectProps {
	color: string,
}

export const AvatarSelect = ({ color }: AvatarSelectProps) => {
	return (
		<button className={`
			hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
			focus-visible:outline-2 outline-b5 outline-offset-5
			h-20 aspect-square rounded-sm
			${color}
		`}/>
	)
}
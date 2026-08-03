import { useProfileStore } from "../../store/ProfileStore";

interface AvatarSelectButtonProps {
	id: string,
	color: string,
}

export const AvatarSelectButton = ({ id, color }: AvatarSelectButtonProps) => {
	const { data, setProfileDataValue } = useProfileStore();

	return (
		<button 
			onClick={() => setProfileDataValue("avatar", id)}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-double outline-b5 outline-offset-5
				h-20 aspect-square rounded-sm
				${id === data.avatar && "outline-2"}
				${color}
		`}/>
	)
}
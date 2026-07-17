import { usePlayerStore } from "../../store/PlayerStore";

interface AvatarSelectButtonProps {
	id: string,
	color: string,
}

export const AvatarSelectButton = ({ id, color }: AvatarSelectButtonProps) => {
	const { data, setPlayerDataValue } = usePlayerStore();

	return (
		<button 
			onClick={() => setPlayerDataValue("avatar", id)}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-2 outline-b5 outline-offset-5
				h-20 aspect-square rounded-sm
				${id === data.avatar && "outline-double"}
				${color}
		`}/>
	)
}
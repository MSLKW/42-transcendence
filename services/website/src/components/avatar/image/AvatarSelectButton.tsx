import { useUiSoundProps } from "../../../utilities/audio/useUiSoundProps";

interface AvatarSelectButtonProps {
	id: string | null;
	avatar: string | undefined;
	setAvatar: (img: string) => void;
	setHasChange: (change: boolean) => void;
}

export const AvatarSelectButton = ({ id, avatar, setAvatar, setHasChange }: AvatarSelectButtonProps) => {
	return (
		<button 
			type="button"
			{...useUiSoundProps()}
			onClick={() => {
				setAvatar(id ?? "");
				setHasChange(true);
			}}
			tabIndex={-1}
			className={`
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus:outline-double hover:not-disabled:outline-double outline-b5
				${id === avatar ? "outline-2 border-b4 bg-b5/40" : "border-n2 bg-n3/20"}
				h-6rem aspect-square
				border rounded-sm
				cursor-pointer
		`}>
			{id &&
				<img
					src={id}
					alt={id}
					loading="lazy"
					className="h-full w-full"
				/>
			}
		</button>
	)
}
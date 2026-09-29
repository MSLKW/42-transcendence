import { useState, useEffect } from 'react';
import { useProfileStore } from '../../../store/ProfileStore';

interface AvatarSetCustomButtonProps {
	id: string | null;
	avatar: string | undefined;
	setAvatar: (img: string) => void;
	setHasChange: (change: boolean) => void;
}

export const AvatarSetCustomButton = ({ id, avatar, setAvatar, setHasChange }: AvatarSetCustomButtonProps) => {
	const avatarVersion = useProfileStore((store) => store.avatarVersions[id ?? ""]);

	const [ imageExists, setImageExists ] = useState<boolean>(true);

	useEffect(() => {
		setImageExists(true);
	}, [id, avatarVersion]);

	const imagePath = `avatars/${id}.webp`;
	const imageSrc = `${imagePath}?v=${avatarVersion ?? 0}`;

	if (!id || !imageExists)
		return null;

	return (
		<>
			<button
				onClick={() => {
					setAvatar(imagePath);
					setHasChange(true);
				}}
				className={`
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-double hover:not-disabled:outline-double outline-b5 outline-offset-5
					${imagePath === avatar ? "outline-2 border-b4 bg-b5/40" : "border-n2 bg-n3/20"}
					h-6rem aspect-square overflow-hidden
					border rounded-sm
					cursor-pointer
			`}>
				<img
					src={imageSrc}
					alt={`${id}.webp`}
					onError={() => setImageExists(false)}
					className="h-full w-full"
				/>
			</button>
		</>
	)
}
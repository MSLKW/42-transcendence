import { AvatarSetImageButton } from "./AvatarSetImageButton";

interface AvatarSelectModuleProps {
	avatar: string,
	setAvatar: (avatar: string) => void;
}
export const AvatarSelectModule = ({ avatar, setAvatar }: AvatarSelectModuleProps) => {
	return (
		<div className="
			grid grid-rows-3 grid-cols-4
			place-content-center place-items-center
			gap-5
			p-5
		">
			<AvatarSetImageButton
				id="stock-0.webp"
				color="bg-a4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-1.webp"
				color="bg-b4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-2.webp"
				color="bg-c4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-3.webp"
				color="bg-d4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-4.webp"
				color="bg-r4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-5.webp"
				color="bg-a4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-6.webp"
				color="bg-b4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-7.webp"
				color="bg-c4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-8.webp"
				color="bg-d4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-9.webp"
				color="bg-r4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-10.webp"
				color="bg-a4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
			<AvatarSetImageButton
				id="stock-11.webp"
				color="bg-b4"
				avatar={avatar}
				setAvatar={setAvatar}
			/>
		</div>
	);
}

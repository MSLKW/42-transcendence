import { useAuthStore } from "../../../store/AuthStore";
import { AvatarSetCustomButton } from "./AvatarSetCustomButton";
import { AvatarSelectButton } from "./AvatarSelectButton";
import { AvatarUploadButton } from "./AvatarUploadButton";

interface AvatarSelectModuleProps {
	avatar: string | undefined;
	setAvatar: (avatar: string) => void;
	setHasChange: (change: boolean) => void;
}
export const AvatarSelectModule = ({ avatar, setAvatar, setHasChange }: AvatarSelectModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const AVATAR_IMGS = [
		"avatar-male-0.webp", "avatar-female-0.webp", "avatar-animal-0.webp",
		"avatar-male-1.webp", "avatar-female-1.webp", "avatar-animal-1.webp",
		"avatar-male-2.webp", "avatar-female-2.webp", "avatar-animal-2.webp",
		"avatar-male-3.webp", "avatar-female-3.webp", "avatar-animal-3.webp",
		"avatar-male-4.webp", "avatar-female-4.webp", "avatar-animal-4.webp",
		"avatar-male-5.webp", "avatar-female-5.webp", "avatar-animal-5.webp",
		"avatar-male-6.webp", "avatar-female-6.webp", "avatar-animal-6.webp",
		"avatar-male-7.webp", "avatar-female-7.webp", "avatar-animal-7.webp",
		"avatar-male-8.webp", "avatar-female-8.webp", "avatar-animal-8.webp",
		"avatar-male-9.webp", "avatar-female-9.webp", "avatar-animal-9.webp",
		"avatar-male-10.webp", "avatar-female-10.webp", "avatar-animal-10.webp",
		"avatar-male-11.webp", "avatar-female-11.webp", "avatar-animal-11.webp",
		"avatar-robot-0.webp", "avatar-robot-2.webp", "avatar-robot-4.webp",
		"avatar-robot-1.webp", "avatar-robot-3.webp", "avatar-robot-5.webp",
	] as const;

	return (
		<div className="flex gap-1rem">
			<div className="
				grid grid-flow-col auto-cols-max grid-rows-3
				gap-1rem py-2rem px-2rem
				overflow-x-auto
				bg-dark-semi rounded-xl
			">
				{
					AVATAR_IMGS.map((img) => {
						return (
							<AvatarSelectButton
								key={img}
								id={img}
								avatar={avatar}
								setAvatar={setAvatar}
								setHasChange={setHasChange}
							/>
						);
					})
				}
			</div>
			<div className="
				flex flex-col
				place-content-center place-items-center
				h-auto px-1rem gap-1rem
				bg-dark-semi rounded-xl
			">
				<AvatarUploadButton setAvatar={setAvatar}/>
				<AvatarSetCustomButton
					id={clientUuid}
					avatar={avatar}
					setAvatar={setAvatar}
					setHasChange={setHasChange}
				/>
			</div>
		</div>
	);
}

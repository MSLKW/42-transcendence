import { useAuthStore } from "../../../store/AuthStore";
import { AvatarSetCustomButton } from "./AvatarSetCustomButton";
import { AvatarSelectButton } from "./AvatarSelectButton";
import { AvatarUploadButton } from "./AvatarUploadButton";

interface AvatarSelectModuleProps {
	avatar: string | undefined;
	setAvatar: (avatar: string) => void;
	setHasChange?: (change: boolean) => void;
}
export const AvatarSelectModule = ({ avatar, setAvatar, setHasChange = () => {} }: AvatarSelectModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const AVATAR_IMGS = [
		"/avatars/avatar-male-0.webp", "/avatars/avatar-female-0.webp", "/avatars/avatar-animal-0.webp",
		"/avatars/avatar-male-1.webp", "/avatars/avatar-female-1.webp", "/avatars/avatar-animal-1.webp",
		"/avatars/avatar-male-2.webp", "/avatars/avatar-female-2.webp", "/avatars/avatar-animal-2.webp",
		"/avatars/avatar-male-3.webp", "/avatars/avatar-female-3.webp", "/avatars/avatar-animal-3.webp",
		"/avatars/avatar-male-4.webp", "/avatars/avatar-female-4.webp", "/avatars/avatar-animal-4.webp",
		"/avatars/avatar-male-5.webp", "/avatars/avatar-female-5.webp", "/avatars/avatar-animal-5.webp",
		"/avatars/avatar-male-6.webp", "/avatars/avatar-female-6.webp", "/avatars/avatar-animal-6.webp",
		"/avatars/avatar-male-7.webp", "/avatars/avatar-female-7.webp", "/avatars/avatar-animal-7.webp",
		"/avatars/avatar-male-8.webp", "/avatars/avatar-female-8.webp", "/avatars/avatar-animal-8.webp",
		"/avatars/avatar-male-9.webp", "/avatars/avatar-female-9.webp", "/avatars/avatar-animal-9.webp",
		"/avatars/avatar-male-10.webp", "/avatars/avatar-female-10.webp", "/avatars/avatar-animal-10.webp",
		"/avatars/avatar-male-11.webp", "/avatars/avatar-female-11.webp", "/avatars/avatar-animal-11.webp",
		"/avatars/avatar-robot-0.webp", "/avatars/avatar-robot-2.webp", "/avatars/avatar-robot-4.webp",
		"/avatars/avatar-robot-1.webp", "/avatars/avatar-robot-3.webp", "/avatars/avatar-robot-5.webp",
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

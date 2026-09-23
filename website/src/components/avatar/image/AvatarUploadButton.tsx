import { useRef } from "react";
import { handlePutAvatar } from "../../../api/profile/put_avatar/handlePutAvatar"
import { useAuthStore } from "../../../store/AuthStore";
import { useProfileStore } from "../../../store/ProfileStore";

interface AvatarUploadButtonProps {
	setAvatar: (img: string) => void;
}

export const AvatarUploadButton = ({ setAvatar }: AvatarUploadButtonProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const markAvatarUpdated = useProfileStore((store) => store.markAvatarUpdated);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file || !clientUuid)
			return;

		const allowedTypes = [
			"image/png",
			"image/jpeg",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type))
			return;

		try {
			await handlePutAvatar(file);
			markAvatarUpdated(clientUuid);
			setAvatar(`avatars/${clientUuid}.png`);
		} finally {
			event.target.value = "";
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="hidden"
			/>
			<button
				type="button"
				onClick={handleClick}
				className="
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-double hover:not-disabled:outline-double outline-b5 outline-offset-5
					border-n2 bg-n3/20
					h-6rem aspect-square
					border rounded-sm
					cursor-pointer
			">
				<img
					src="avatar-upload.webp"
					alt="Upload avatar"
				/>
			</button>
		</>
	)
}
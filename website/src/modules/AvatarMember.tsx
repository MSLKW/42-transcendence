import { useSceneStore } from "../store/SceneStore";
import { AvatarImage } from "../components/image/AvatarImage";
import { AvatarName } from "../components/label/AvatarName";

export const AvatarMemberModule = () => {
	const { profileFocus } = useSceneStore();

	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="flex flex-col gap-3 place-content-center place-items-center">
				<AvatarImage />
				<AvatarName playerIndex={profileFocus} />
			</div>
		</div>
	);
}
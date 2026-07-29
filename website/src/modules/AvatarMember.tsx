import { AvatarImage } from "../components/image/AvatarImage";
import { AvatarName } from "../components/label/AvatarName";

interface AvatarMemberProps {
	name: string;
}

export const AvatarMemberModule = ({ name = "Player" }: AvatarMemberProps) => {
	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="flex flex-col gap-3 place-content-center place-items-center">
				<AvatarImage />
				<AvatarName name={name} />
			</div>
		</div>
	);
}
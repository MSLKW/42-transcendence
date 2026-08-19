import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";

interface AvatarMemberProps {
	name: string;
	image: string;
}

export const AvatarMemberModule = ({ name, image = "stock-0.png" }: AvatarMemberProps) => {
	if (!name)
		return;
	
	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="flex flex-col gap-3 place-content-center place-items-center">
				{image && <AvatarImage />}
				{name && <AvatarName name={name} />}
			</div>
		</div>
	);
}
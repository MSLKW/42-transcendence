import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";

interface AvatarMemberProps {
	uuid: string | null;
	name: string;
	image: string | undefined;
}

export const AvatarMemberModule = ({ uuid, name, image }: AvatarMemberProps) => {
	if (!name)
		return;

	return (
		<div className="
			flex place-content-evenly place-items-center
			p-5
			gap-5
		">
			<div className="flex flex-col gap-3 place-content-center place-items-center">
				<AvatarImage uuid={uuid ?? undefined} image={image} />
				{name && <AvatarName name={name} />}
			</div>
		</div>
	);
}
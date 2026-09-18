interface AvatarProps {
	name: string;
}

export const AvatarName = ({ name = "Player" }: AvatarProps) => {
	return (
		<div
			className={`
				max-w-24
				text-n6 truncate
				flex place-content-center place-items-center
			`}
		>
			<h3>{name}</h3>
		</div>
	);
}
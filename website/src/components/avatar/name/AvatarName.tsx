interface AvatarProps {
	name: string;
	style?: string;
}

export const AvatarName = ({ name = "Player", style = "default" }: AvatarProps) => {
	return (
		<div
			className={`
				w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
				h-fit
				text-[clamp(0.25rem,1.5vh+0.125rem,1rem)]
				text-n6
				truncate
				flex place-content-center place-items-center
				px-[clamp(0.625rem,1vh+0.3125rem,1.25rem)]
			`}
		>
			<h3>{name}</h3>
		</div>
	);
}